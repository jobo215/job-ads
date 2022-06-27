import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: [process.env.COOKIE_KEY],
    }),
  );
  app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  }))
  await app.listen(3000 || process.env.PORT);
}
bootstrap();
