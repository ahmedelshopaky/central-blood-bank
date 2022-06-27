import client from '../database';
import { BloodType } from './BloodStockModel';

export type Donor = {
  id?: number; // PK
  nationalId: string;
  name: string;
  city?: string;
  email: string;
  lastDonation?: Date;
  bloodType: BloodType;
};

export class DonorModel {
  static create = async (donor: Donor): Promise<Donor> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO donors (national_id, name, city, email, last_donation, blood_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const result = await conn.query(sql, [
        donor.nationalId,
        donor.name,
        donor.city,
        donor.email,
        donor.lastDonation,
        donor.bloodType,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot create this donor');
    }
  };

  static get = async (donorNationalId: string): Promise<Donor> => {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM donors WHERE national_id=$1';
      const result = await conn.query(sql, [donorNationalId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot get this donor');
    }
  };

  static update = async (donorNationalId: string): Promise<Donor> => {
    try {
      const conn = await client.connect();
      const sql =
        'UPDATE donors SET last_donation=NOW() WHERE national_id=$1 RETURNING *';
      const result = await conn.query(sql, [donorNationalId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot update this donor');
    }
  };
}
