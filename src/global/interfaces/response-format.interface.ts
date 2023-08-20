export interface ResponseFormat {
  success: boolean;
  statusCode: number;
  message: string;
  error?: any[];
  data?: any;
}
