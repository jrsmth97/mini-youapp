import { ResponseFormat } from '../interfaces/response-format.interface';

export class ResponseBuilder {
  public static SuccessResponse(
    message: string,
    statusCode: number,
    data?: any,
  ): ResponseFormat {
    return {
      success: true,
      message: message,
      statusCode: statusCode,
      data: data,
    };
  }

  public static ErrorResponse(
    message: string,
    statusCode: number,
    error?: any,
  ): ResponseFormat {
    return {
      success: false,
      message: message,
      statusCode: statusCode,
      data: null,
      error: error,
    };
  }
}
