import { ResponseDto } from "../api";

export const getSuccess = <T>(data: T, dataName: string): ResponseDto => {
  return {
    status: true,
    statusCode: 200,
    message: `${dataName} fetched successfully`,
    data: data,
  };
};

export const createSuccess = <T>(data: T, dataName: string): ResponseDto => {
  return {
    status: true,
    statusCode: 201,
    message: `${dataName} created successfully`,
    data: data,
  };
};

export const updateSuccess = <T>(data: T, dataName: string): ResponseDto => {
  return {
    status: true,
    statusCode: 200,
    message: `${dataName} updated successfully`,
    data: data,
  };
};

export const deleteSuccess = (dataId: string, dataName: string): ResponseDto => {
  return {
    status: true,
    statusCode: 200,
    message: `${dataName}-${dataId} deleted successfully`,
    data: dataId,
  };
};
