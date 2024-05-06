import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { json, Request, Response } from 'express';

//docs.nestjs.com/exception-filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse: any = {
        errorsMessages: [],
      };

      const responseBody: any = exception.getResponse();

      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((e) => {
          errorsResponse.errorsMessages.push(e);
        });
      } else {
        errorsResponse.errorsMessages.push(responseBody.message);
      }
      response.status(status).json(errorsResponse);
    } else if (status === HttpStatus.UNAUTHORIZED) {
      response.status(status).json(exception.message);
    } else if (status === HttpStatus.NOT_FOUND) {
      response.status(status).json(exception.message);
    } else if (status === HttpStatus.TOO_MANY_REQUESTS) {
      response.status(status).json(exception.message);
    } else if (status === HttpStatus.FORBIDDEN) {
      response.status(status).json(exception.message);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();
//
//     if (status === HttpStatus.BAD_REQUEST) {
//       const errorsResponse: any = {
//         errorsMessages: [],
//       };
//
//       const responseBody: any = exception.getResponse();
//       console.log(responseBody);
//
//       if (Array.isArray(responseBody.message)) {
//         const firstError = responseBody.message[0];
//         const [field, message] = Object.entries(firstError)[0];
//         errorsResponse.errorsMessages.push({ field, message });
//       } else {
//         const [field, message] = Object.entries(responseBody.message)[0];
//         errorsResponse.errorsMessages.push({ field, message });
//       }
//
//       response.status(status).json(errorsResponse);
//     } else if (
//       status === HttpStatus.UNAUTHORIZED ||
//       status === HttpStatus.NOT_FOUND ||
//       status === HttpStatus.TOO_MANY_REQUESTS
//     ) {
//       response.status(status).json(exception.message);
//     } else {
//       response.status(status).json({
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         path: request.url,
//       });
//     }
//   }
// }
