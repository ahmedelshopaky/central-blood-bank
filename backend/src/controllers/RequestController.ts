import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestModel, Request, RequestStatus } from '../models/RequestModel';
import { RequestValidation } from './validations/RequestValidation';
import client from '../database';

const RequestRouter = express.Router();

const getPendingRequestsNumber = async () => {
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
      requestStatus: RequestStatus.PENDING,
      bloodType: req.body.bloodType,
      quantity: req.body.quantity,
      hospitalId: req.body.hospitalId,
      // bloodStockId: req.body.bloodStockId,
    };
    const newRequest = await RequestModel.create(request);
    res.status(201).json({
      Data: newRequest,
      Message: 'object',
      Success: true,
    });
    const requestsNumber = await getPendingRequestsNumber();
    if (requestsNumber > 10) {
      const conn = await client.connect();
      const sql = `SELECT * FROM requests WHERE request_status='pending' LIMIT 1`;
      const result = await conn.query(sql);
      conn.release();
      const request = result.rows[0];
      const newRequestStatus = RequestStatus.APPROVED;
      await RequestModel.update(request.id, newRequestStatus);
    }
  } catch (error) {
    next(error);
  }
};

RequestRouter.post('/request', RequestValidation, create);
export default RequestRouter;
