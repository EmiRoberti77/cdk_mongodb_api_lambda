import { handler } from '../src/lambdas/Mongodb/handler';

handler({} as any)
  .then((success) => {
    console.log(success);
  })
  .catch((err) => console.log(err));
