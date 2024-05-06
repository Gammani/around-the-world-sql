import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../infrastructure/exception-filters/http-exception-filter';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import cookieParser from 'cookie-parser';

// Используем данную функцию в main.ts и в e2e тестах
export const applyAppSettings = (app: INestApplication) => {
  // для кастомных декораторов
  // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // глобальные pipes
  setAppPipes(app);
  // глобальный фильтр
  setAppExceptionsFilters(app);

  app.enableCors();
  app.use(cookieParser());
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse: any = [];

        errors.forEach((e: any) => {
          const constraintKeys: any = Object.keys(e.constraints);
          constraintKeys.forEach((key) => {
            errorsForResponse.push({
              message: e.constraints[key],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};
