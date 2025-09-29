import { ResponseDto } from "../api";

export const missingError = (data: string): ResponseDto => {
  return {
    status: false,
    statusCode: 400,
    message: `${data} is required`,
  } as ResponseDto;
};

export const updateFailed = (data: string): ResponseDto => {
  return {
    status: false,
    statusCode: 400,
    message: `${data} update failed`,
  } as ResponseDto;
};

export const deleteFailed = (data: string): ResponseDto => {
  return {
    status: false,
    statusCode: 400,
    message: `${data} delete failed`,
  } as ResponseDto;
};

export const notFoundError = (data: string): ResponseDto => {
  return {
    status: false,
    statusCode: 404,
    message: `${data} not found`,
  };
};

export const serverError = (error?: ResponseDto): ResponseDto => {
  const { statusCode, message } = error ?? {};

  return {
    status: false,
    statusCode: statusCode ?? 500,
    message: message ?? "Internal Server Error",
  };
};
