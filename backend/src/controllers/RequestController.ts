import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestModel, Request, RequestStatus } from '../models/RequestModel';
import { RequestValidation } from './validations/RequestValidation';
import client from '../database';
import {
  BloodStock,
  BloodStockModel,
  BloodType,
} from '../models/BloodStockModel';

const RequestRouter = express.Router();

const getPendingRequestsNumber = async (): Promise<number> => {
  const conn = await client.connect();
  const sql = `SELECT COUNT(*) FROM requests WHERE request_status='${RequestStatus.PENDING}'`;
  const result = await conn.query(sql);
  conn.release();
  return result.rows[0]['count'];
};

// this function is used to get all pending requests ordered by patient status
const getPendingRequests = async (): Promise<Request[]> => {
  const conn = await client.connect();
  const sql = `SELECT * FROM requests WHERE request_status='${RequestStatus.PENDING}' ORDER BY patient_status`;
  const result = await conn.query(sql);
  conn.release();
  return result.rows;
};

// this function is used to get avialable blood type which has shortest distance between a specific hospital and all blood banks
const getAvailableShortestDistanceBloodStock = async (
  bloodType: BloodType,
  hospitalId: number,
  quantity = 1
): Promise<BloodStock[]> => {
  const conn = await client.connect();
  const sql = `SELECT blood_stocks.id, blood_stocks.blood_type, cities_distances.blood_bank_id, cities_distances.hospital_id, cities_distances.distance
    FROM blood_stocks
    INNER JOIN cities_distances
    ON blood_stocks.blood_bank_id = cities_distances.blood_bank_id
    AND blood_stocks.blood_type = '${bloodType}'
    AND cities_distances.hospital_id = ${hospitalId}
    ORDER BY distance ASC
    LIMIT ${quantity}`;
  const result = await conn.query(sql);
  conn.release();
  return result.rows;
};

// this function get pending requests ordered by patient status then reorder them by distance
// so i can serve hospitals requests from nearest hospitals first
const getOrderedRequests = async () => {
  const requests = await getPendingRequests();
  const bloodStocks = [];
  for (const request of requests) {
    const bloodStock = await getAvailableShortestDistanceBloodStock(
      request['blood_type'],
      request['hospital_id'],
      request['quantity']
    );
    for (const stock of bloodStock) {
      // BloodStockModel.delete(stock['id'] as number);
      if (stock) {
        bloodStocks.push({
          ...stock,
          request: request['id'],
        });
      }
    }
  }
  bloodStocks.sort((a, b) => a['distance'] - b['distance']);
  return bloodStocks;
};

// this function get ordered requests, then
// for each request i will delete its blood type from blood stock if exists
const handleRequests = async () => {
  const bloodStocks = await getOrderedRequests();
  for (const bloodStock of bloodStocks) {
    const deletedBloodStock = await BloodStockModel.delete(
      bloodStock['id'] as number
    );
    if (deletedBloodStock) {
      const updatedRequest = await RequestModel.updateAvailable(
        bloodStock['request'] as number
      );
      if (updatedRequest['quantity'] === updatedRequest['available']) {
        await RequestModel.updateRequestStatus(
          bloodStock['request'],
          RequestStatus.APPROVED
        );
      }
    }
  }
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
    };

    const newRequest = await RequestModel.create(request);
    res.status(201).json({
      Data: newRequest,
      Message: 'object',
      Success: true,
    });

    const requestsNumber = await getPendingRequestsNumber();
    if (requestsNumber >= 10) {
      handleRequests();
    }
  } catch (error) {
    next(error);
  }
};

RequestRouter.post('/request', RequestValidation, create);
export default RequestRouter;
