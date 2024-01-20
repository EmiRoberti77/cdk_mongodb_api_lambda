import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_CODE, HTTP_METHOD, jsonApiProxyResultResponse } from '../../util';
import { MongoDBService } from './MongoDbService';
import { Equine } from './models/models';

const notImplemented = (httpMethod: string) => `${httpMethod} not implemented`;
const user = 'vetapp';
const pass = 'vetapp123';
const dbName = 'vetapp';
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const httpMethod = event.httpMethod;
  switch (httpMethod) {
    case HTTP_METHOD.GET:
    case HTTP_METHOD.DELETE:
    case HTTP_METHOD.PUT:
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: true,
        body: notImplemented(httpMethod),
      });
    case HTTP_METHOD.POST:
      if (!event.body) {
        return jsonApiProxyResultResponse(HTTP_CODE.OK, {
          message: true,
          body: 'Body missing',
        });
      }

      const db = new MongoDBService({
        user,
        pass,
        dbName,
      });

      const opened = await db.open();
      if (!opened) {
        return jsonApiProxyResultResponse(HTTP_CODE.OK, {
          message: true,
          body: 'database failed to open',
        });
      }

      const newEquine = JSON.parse(event.body) as Equine;
      const isInserted: boolean = await db.insert(newEquine);
      await db.close();

      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: true,
        body: newEquine,
      });

    default:
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: true,
        body: notImplemented(httpMethod),
      });
  }
};
