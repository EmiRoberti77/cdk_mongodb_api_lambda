import { handler } from '../src/lambdas/Mongodb/handler';
import { Equine } from '../src/lambdas/Mongodb/models/models';
import { HTTP_METHOD } from '../src/util';

const params = {
  httpMethod: HTTP_METHOD.POST,
  body: JSON.stringify({
    ueln: 12345677889,
    type: 'horse type A1',
    color: 'white',
    vaccination: 'completed',
    vaccinationDate: '20/1/2024',
  } as Equine),
};

handler(params as any)
  .then((success) => {
    console.log(success);
  })
  .catch((err) => console.log(err));
