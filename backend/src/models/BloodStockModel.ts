import client from '../database';

export enum BloodType {
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
}

export type BloodStock = {
  id?: number; // PK
  donorNationalId: string; // FK
  expirationDate: Date;
  bloodType: BloodType;
  bloodBankId: number; // FK
};

export class BloodStockModel {
  static create = async (
    bloodStockInstance: BloodStock
  ): Promise<BloodStock> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO blood_stocks (blood_type, blood_bank_id, expiration_date, donor_national_id) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [
        bloodStockInstance.bloodType,
        bloodStockInstance.bloodBankId,
        bloodStockInstance.expirationDate,
        bloodStockInstance.donorNationalId,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot create this blood stock instance');
    }
  };
}
