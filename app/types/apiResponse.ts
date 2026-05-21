export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: object | null;
  errors: string[];
}