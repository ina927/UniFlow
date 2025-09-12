import { NextResponse, type NextRequest } from 'next/server';
import { ResponseDto } from '../dto';
import { ApiParams } from '../models';

export const withDB = (handler: (req: NextRequest, params?: ApiParams) => Promise<ResponseDto>) => {
  return async (req: NextRequest, params?: ApiParams) => {
    try {
      return NextResponse.json(await handler(req, params));
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json({
        status: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  };
}
