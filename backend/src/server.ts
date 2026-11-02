import App from '@/app';
import { EducationController } from '@controllers/education/education.controller';
import { HealthController } from '@controllers/health.controller';
import { IndexController } from '@controllers/index.controller';
import { PupilForecastController } from '@controllers/pupilforecast/pupilforecast.controller';
import { UserController } from '@controllers/user.controller';
import { initRedis } from '@utils/initRedis';
import validateEnv from '@utils/validateEnv';

validateEnv();

async function bootstrap() {
  // Connects Redis only when SESSION_STORE=redis; App then builds the session store from it.
  await initRedis();

  const app = new App([
    IndexController,
    UserController,
    HealthController,
    PupilForecastController,
    EducationController,
  ]);

  app.listen();
}

bootstrap().catch(err => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
