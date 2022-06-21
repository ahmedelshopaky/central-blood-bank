import express, { NextFunction, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import DonorRouter from './controllers/DonorController';

const app = express();
const HOST = 'localhost';
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req: express.Request, res: express.Response): void => {
  res.status(200).json({
    Data: 'Hello there!',
    Message: 'string',
    Success: true,
  });
});

app.use(DonorRouter);

// Not Found MW
app.use((req: express.Request, res: express.Response): void => {
  res.status(404).json({
    Data: 'Not found',
    Message: 'string',
    Success: true,
  });
});

// Error MW
app.use(
  (
    err: ErrorRequestHandler,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ): void => {
    console.log(err + '');
    res.status(500).json({
      Data: 'Something broke',
      Message: 'string',
      Success: false,
    });
  }
);

app.listen(PORT as number, HOST, () => {
  console.log(`starting app on ${HOST}:${PORT}`);
});

export default app;
