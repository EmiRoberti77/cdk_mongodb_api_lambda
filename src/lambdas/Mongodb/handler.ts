import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return jsonApiProxyResultResponse(HTTP_CODE.OK, { message: true });
};
