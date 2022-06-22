import client from '../database';

enum BloodType {
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
}

export type BloodStockType = {
  id?: number; // PK
  donorId: number; // FK
  date: Date;
  bloodType: BloodType;
  bankCity: string;
};

export class BloodStockModel {
  static create = async (
    bloodStockInstance: BloodStockType
  ): Promise<BloodStockType> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO blood_stock (blood_type, bank_city, date, donor_id) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [
        bloodStockInstance.bloodType,
        bloodStockInstance.bankCity,
        bloodStockInstance.date,
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
