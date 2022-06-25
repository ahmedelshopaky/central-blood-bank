import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestModel, Request } from '../models/RequestModel';
import { RequestValidation } from './validations/RequestValidation';
import client from '../database';

const RequestRouter = express.Router();

const getRequestsNumber = async () => {
  const conn = await client.connect();
  const sql = `SELECT COUNT(*) FROM requests WHERE request_status='pending'`;
  const result = await conn.query(sql);
  conn.release();
  return result.rows[0]['count'];
};

const create = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestsNumber = await getRequestsNumber();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        Data: errors,
        Message: 'validation errors',
        Success: false,
      });
      return;
    }

    const request: Request = {
      patientStatus: req.body.patientStatus,
      requestStatus: req.body.requestStatus,
      bloodType: req.body.bloodType,
      quantity: req.body.quantity,
      hospitalId: req.body.hospitalId,
      bloodStockId: req.body.bloodStockId,
    };
    const newRequest = await RequestModel.create(request);
    res.status(201).json({
      Data: newRequest,
      Message: 'object',
      Success: true,
    });
  } catch (error) {
    next(error);
  }
};

RequestRouter.post('/request', RequestValidation, create);
export default RequestRouter;
