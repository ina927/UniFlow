import { NextResponse, type NextRequest } from 'next/server';
import { ResponseDto } from '../dto';
import { ApiParams } from '../models';
import { serverError } from '@/shared/consts';

export const controller = <TParams extends Record<string, string> = {}>(
  handler: (req: NextRequest, ctx: ApiParams<TParams>) => Promise<ResponseDto>
) => {
  return async (req: NextRequest, ctx: ApiParams<TParams>) => {
    try {
      return NextResponse.json(await handler(req, ctx));
    } catch (error) {
      return NextResponse.json(serverError(error as ResponseDto));
    }
  };
};