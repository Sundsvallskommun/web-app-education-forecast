import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { PupilForecastController } from './controllers/pupilforecast/pupilforecast.controller';
import { EducationController } from './controllers/education/education.controller';

validateEnv();

const app = new App([IndexController, UserController, HealthController, PupilForecastController, EducationController]);

app.listen();
