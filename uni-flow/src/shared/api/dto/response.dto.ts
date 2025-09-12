export interface ResponseDto<T = unknown> {
  status: boolean;
  statusCode: number;
  message: string;
  data?: T;
}
