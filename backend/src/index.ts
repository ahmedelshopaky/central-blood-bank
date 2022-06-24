import express, { NextFunction, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import DonorRouter from './controllers/DonorController';
import BloodStockRouter from './controllers/BloodStockController';
import HospitalRouter from './controllers/HospitalController';
import RequestRouter from './controllers/RequestController';

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
app.use(BloodStockRouter);
app.use(HospitalRouter);
app.use(RequestRouter);

// Not Found MW
app.use((req: express.Request, res: express.Response): void => {
  res.status(404).json({
    Data: 'Not found',
    Message: 'invalid route',
    Success: false,
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
      Message: 'internal server error',
      Success: false,
    });
  }
);

app.listen(PORT as number, HOST, () => {
  console.log(`starting app on ${HOST}:${PORT}`);
});

export default app;
