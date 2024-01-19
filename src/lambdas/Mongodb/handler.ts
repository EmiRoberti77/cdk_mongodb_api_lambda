import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';
import { MongoClient } from 'mongodb';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const uri = '<replace>';

  try {
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('vetapp').command({ ping: 1 });
    console.info('database successfully pinged');
    await client.close();
  } catch (err: any) {
    console.error(err.message);
  }

  return jsonApiProxyResultResponse(HTTP_CODE.OK, { message: true });
};
