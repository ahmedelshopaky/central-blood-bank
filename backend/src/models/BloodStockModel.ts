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
  donorId: number; // FK
  expirationDate: Date;
  bloodType: BloodType;
  bankCity: string;
};

export class BloodStockModel {
  static create = async (
    bloodStockInstance: BloodStock
  ): Promise<BloodStock> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO blood_stock (blood_type, bank_city, expiration_date, donor_id) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [
        bloodStockInstance.bloodType,
        bloodStockInstance.bankCity,
        bloodStockInstance.expirationDate,
        bloodStockInstance.donorId,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot create this blood stock instance');
    }
  };
}
