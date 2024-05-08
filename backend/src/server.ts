import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { ForecastController } from './controllers/forecast/forecast.controller';
import { EducationController } from './controllers/education/education.controller';

validateEnv();

const app = new App([IndexController, UserController, HealthController, ForecastController, EducationController]);

app.listen();
