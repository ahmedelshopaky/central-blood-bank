import client from '../database';
import { BloodType } from './BloodStockModel';

enum PatientStatus {
  'IMMEDIATE' = 'immediate',
  'URGENT' = 'urgent',
  'NORMAL' = 'normal',
}
export enum RequestStatus {
  'PENDING' = 'pending',
  'APPROVED' = 'approved',
  'REJECTED' = 'rejected',
}

export type Request = {
  id?: number; // PK
  patientStatus: PatientStatus;
  requestStatus?: RequestStatus;
  bloodType: BloodType;
  quantity: number;
  hospitalId: number; // FK
  bloodStockId?: number; // FK
};

export class RequestModel {
  static create = async (request: Request): Promise<Request> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO requests (patient_status, request_status, blood_type, quantity, hospital_id, blood_stock_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const result = await conn.query(sql, [
        request.patientStatus,
        request.requestStatus,
        request.bloodType,
        request.quantity,
        request.hospitalId,
        request.bloodStockId,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot create this request');
    }
  };

  static update = async (
    id: number,
    requestStatus: RequestStatus
  ): Promise<Request> => {
    try {
      const conn = await client.connect();
      const sql =
        'UPDATE requests SET request_status=$1 WHERE id=$2 RETURNING *';
      const result = await conn.query(sql, [requestStatus, id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot update this request');
    }
  };
}
