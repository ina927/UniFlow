import { NextResponse, type NextRequest } from 'next/server';
import { ResponseDto } from '../dto';
import { ApiParams } from '../models';
import { serverError } from '@/shared/consts';

export const controller = (handler: (req: NextRequest, params: ApiParams) => Promise<ResponseDto>) => {
  return async (req: NextRequest, params: ApiParams) => {
    try {
      return NextResponse.json(await handler(req, params));
    } catch (error) {
      return NextResponse.json(serverError(error as ResponseDto));
    }
  };
};
