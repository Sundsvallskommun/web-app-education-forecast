import 'reflect-metadata';
import { existsSync, mkdirSync } from 'fs';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import createFileStore from 'session-file-store';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy, VerifiedCallback } from '@node-saml/passport-saml';
import bodyParser from 'body-parser';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import {
  APP_NAME,
  BASE_URL_PREFIX,
  CREDENTIALS,
  LOG_FORMAT,
  MUNICIPALITY_ID,
  NODE_ENV,
  ORIGIN,
  PORT,
  SAML_CALLBACK_URL,
  SAML_ENTRY_SSO,
  SAML_FAILURE_REDIRECT,
  SAML_IDP_PUBLIC_CERT,
  SAML_ISSUER,
  SAML_LOGOUT_CALLBACK_URL,
  SAML_PRIVATE_KEY,
  SAML_PUBLIC_KEY,
  SAML_SUCCESS_REDIRECT,
  SECRET_KEY,
  SESSION_MEMORY,
  SWAGGER_ENABLED,
} from '@config';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { Profile } from './interfaces/profile.interface';
import { HttpException } from './exceptions/HttpException';
import { join } from 'path';
import { isValidUrl } from './utils/util';
import { additionalConverters } from './utils/custom-validation-classes';
import ApiService from './services/api.service';
import QueryString from 'qs';
import { isValidOrigin } from './utils/isValidOrigin';
import { APIS } from './config/api-config';

const corsWhitelist = ORIGIN?.split(',');
const defaultRedirect = SAML_SUCCESS_REDIRECT ?? '/';
const SessionStoreCreate = SESSION_MEMORY ? createMemoryStore(session) : createFileStore(session);
const sessionTTL = 4 * 24 * 60 * 60;
// NOTE: memory uses ms while file uses seconds
const sessionStore = new SessionStoreCreate(SESSION_MEMORY ? { checkPeriod: sessionTTL * 1000 } : { sessionTTL, path: './data/sessions' });

const apiService = new ApiService();

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

const samlStrategy = new Strategy(
  {
    disableRequestedAuthnContext: true,
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    callbackUrl: SAML_CALLBACK_URL,
    entryPoint: SAML_ENTRY_SSO,
    // decryptionPvk: SAML_PRIVATE_KEY,
    privateKey: SAML_PRIVATE_KEY,
    // Identity Provider's public key
    idpCert: SAML_IDP_PUBLIC_CERT,
    issuer: SAML_ISSUER,
    wantAssertionsSigned: false,
    acceptedClockSkewMs: 1000,
    logoutCallbackUrl: SAML_LOGOUT_CALLBACK_URL,
    wantAuthnResponseSigned: false,
    audience: false,
  },
  async function (profile: Profile, done: VerifiedCallback) {
    if (!profile) {
      return done({
        name: 'SAML_MISSING_PROFILE',
        message: 'Missing SAML profile',
      });
    }
    const { givenName, surname, username } = profile;

    if (!givenName || !surname) {
      return done({
        name: 'SAML_MISSING_ATTRIBUTES',
        message: 'Missing profile attributes',
      });
    }

    try {
      let personId = '';
      const schools: {}[] = [];
      const roles: {}[] = [];
      const employeeApi = APIS.find(api => api.name === 'employee');

      const employeeDetails = await apiService.get<any>({
        url: `${employeeApi.name}/${employeeApi.version}/${MUNICIPALITY_ID}/portalpersondata/PERSONAL/${username}`,
      });
      const { personid } = employeeDetails.data;
      personId = personid;
      const userRole = await apiService.get<[{ role: string; typeOfSchool: string; schoolId: string; schoolName: string }]>({
        url: 'pupilforecast/1.0/2281/forecast/userroles',
        params: { teacherId: personId },
      });

      if (userRole.data) {
        userRole.data.forEach(user => {
          user &&
            schools.push({
              schoolId: user.schoolId,
              schoolName: user.schoolName,
            });

          user &&
            roles.push({
              role: user.role,
              typeOfSchool: user.typeOfSchool,
            });
        });
      } else {
        return done({
          name: 'SAML_MISSING_PERMISSIONS',
          message: 'Failed to fetch user roles from education API, missing schoolId',
        });
      }

      if (!userRole) {
        return done({
          name: 'SAML_MISSING_PERMISSIONS',
          message: 'Failed to fetch user roles from education API',
        });
      }

      const findUser = {
        personId: personId,
        username: username,
        name: `${givenName} ${surname}`,
        givenName: givenName,
        surname: surname,
        roles: roles,
        schools: schools,
      };

      done(null, findUser);
    } catch (err) {
      if (err instanceof HttpException && err?.status === 404) {
        // Handle missing person form Citizen
      }
      done(err);
    }
  },
  async function (profile: Profile, done: VerifiedCallback) {
    return done(null, {});
  },
);

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public swaggerEnabled: boolean;

  constructor(Controllers: Function[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.swaggerEnabled = SWAGGER_ENABLED || false;

    this.initializeDataFolders();

    this.initializeMiddlewares();
    this.initializeRoutes(Controllers);
    if (this.swaggerEnabled) {
      this.initializeSwagger(Controllers);
    }
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(
      session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
      }),
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.use('saml', samlStrategy);

    this.app.use(
      cors({
        credentials: CREDENTIALS,
        origin: function (origin, callback) {
          if (origin === undefined || corsWhitelist?.indexOf(origin) !== -1 || corsWhitelist?.indexOf('*') !== -1) {
            callback(null, true);
          } else {
            if (NODE_ENV == 'development') {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          }
        },
      }),
    );

    this.app.get(
      `${BASE_URL_PREFIX}/saml/login`,
      (req, res, next) => {
        if (req.session.returnTo) {
          req.query.RelayState = req.session.returnTo;
        } else if (req.query.successRedirect) {
          req.query.RelayState = req.query.successRedirect;
        }
        if (req.query.failureRedirect) {
          req.query.RelayState = `${req.query.RelayState},${req.query.failureRedirect}`;
        }
        next();
      },
      (req, res, next) => {
        passport.authenticate('saml', {
          failureRedirect: SAML_FAILURE_REDIRECT,
        })(req, res, next);
      },
    );

    this.app.get(`${BASE_URL_PREFIX}/saml/metadata`, (req, res) => {
      res.type('application/xml');
      const metadata = samlStrategy.generateServiceProviderMetadata(SAML_PUBLIC_KEY, SAML_PUBLIC_KEY);
      res.status(200).send(metadata);
    });

    this.app.get(
      `${BASE_URL_PREFIX}/saml/logout`,
      (req, res, next) => {
        let relayState = defaultRedirect;
        if (req.session.returnTo) {
          relayState = req.session.returnTo;
        }
        if (req.query.successRedirect) {
          relayState = `${req.query.successRedirect}`;
        }
        if (req.query.failureRedirect) {
          relayState = `${relayState},${req.query.failureRedirect}`;
        }
        req.url = `${req.path}?RelayState=${relayState}`;
        next();
      },
      (req, res, next) => {
        let successRedirect = SAML_SUCCESS_REDIRECT;
        const providedRedirect = req.query.successRedirect ?? req.query.RelayState;
        if (typeof providedRedirect === 'string' && isValidUrl(providedRedirect) && isValidOrigin(providedRedirect)) {
          successRedirect = providedRedirect;
        }

        samlStrategy.logout(req as any, () => {
          req.logout(err => {
            if (err) {
              return next(err);
            }
            res.redirect(successRedirect);
          });
        });
      },
    );

    this.app.get(`${BASE_URL_PREFIX}/saml/logout/callback`, bodyParser.urlencoded({ extended: false }), (req, res, next) => {
      req.logout(err => {
        if (err) {
          return next(err);
        }

        let successRedirect: URL, failureRedirect: URL;
        const urls = req?.body?.RelayState.split(',');

        if (isValidUrl(urls[0]) && isValidOrigin(urls[0])) {
          successRedirect = new URL(urls[0]);
        } else {
          successRedirect = new URL(defaultRedirect);
        }

        if (isValidUrl(urls[1]) && isValidOrigin(urls[1])) {
          failureRedirect = new URL(urls[1]);
        } else {
          failureRedirect = successRedirect;
        }

        const queries = new URLSearchParams(failureRedirect.searchParams);

        if (req.session.messages?.length > 0) {
          queries.append('failMessage', req.session.messages[0]);
        } else {
          queries.append('failMessage', 'SAML_UNKNOWN_ERROR');
        }

        if (failureRedirect) {
          res.redirect(failureRedirect.toString());
        } else {
          res.redirect(successRedirect.toString());
        }
      });
    });

    this.app.post(`${BASE_URL_PREFIX}/saml/login/callback`, bodyParser.urlencoded({ extended: false }), (req, res, next) => {
      let successRedirect: URL, failureRedirect: URL;

      let urls = req?.body?.RelayState.split(',');

      if (isValidUrl(urls[0]) && isValidOrigin(urls[0])) {
        successRedirect = new URL(urls[0]);
      } else {
        successRedirect = new URL(defaultRedirect);
      }
      if (isValidUrl(urls[1]) && isValidOrigin(urls[1])) {
        failureRedirect = new URL(urls[1]);
      } else {
        failureRedirect = new URL(urls[0]);
      }
      passport.authenticate('saml', (err, user) => {
        console.log(err);
        if (err) {
          const queries = new URLSearchParams(failureRedirect.searchParams);
          if (err?.name) {
            queries.append('failMessage', err.name);
          } else {
            queries.append('failMessage', 'SAML_UNKNOWN_ERROR');
          }
          failureRedirect.search = queries.toString();
          res.redirect(failureRedirect.toString());
        } else if (!user) {
          res.redirect('/saml/login');
        } else {
          req.login(user, loginErr => {
            if (loginErr) {
              const failMessage = new URLSearchParams(failureRedirect.searchParams);
              failMessage.append('failMessage', 'SAML_UNKNOWN_ERROR');
              failureRedirect.search = failMessage.toString();
              res.redirect(failureRedirect.toString());
            }
            return res.redirect(successRedirect.toString());
          });
        }
      })(req, res, next);
    });
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      routePrefix: BASE_URL_PREFIX,
      cors: {
        origin: ORIGIN,
        credentials: CREDENTIALS,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      },
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initializeSwagger(controllers: Function[]) {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
      additionalConverters: additionalConverters,
    });

    const routingControllersOptions = {
      routePrefix: `${BASE_URL_PREFIX}`,
      controllers: controllers,
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas: schemas,
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http',
          },
        },
      },
      info: {
        title: `${APP_NAME} Proxy API`,
        description: '',
        version: '1.0.0',
      },
    });

    this.app.use(`${BASE_URL_PREFIX}/swagger.json`, (req, res) => res.json(spec));
    this.app.use(`${BASE_URL_PREFIX}/api-docs`, swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeDataFolders() {
    const databaseDir: string = join(__dirname, '../data/database');
    if (!existsSync(databaseDir)) {
      mkdirSync(databaseDir, { recursive: true });
    }
    const logsDir: string = join(__dirname, '../data/logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }
    const sessionsDir: string = join(__dirname, '../data/sessions');
    if (!existsSync(sessionsDir)) {
      mkdirSync(sessionsDir, { recursive: true });
    }
  }
}

export default App;
