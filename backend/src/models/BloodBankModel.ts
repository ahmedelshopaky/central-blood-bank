import client from '../database';

export type BloodBank = {
  id?: number; // PK
  name: string;
  city: string;
  latitude: number;
  longitude: number;
};

export class BloodBankModel {
  static create = async (bloodBank: BloodBank): Promise<BloodBank> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO blood_banks (name, city, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [
        bloodBank.name,
        bloodBank.city,
        bloodBank.latitude,
        bloodBank.longitude,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot create this blood bank');
    }
  };

  static getAll = async (): Promise<BloodBank[]> => {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM blood_banks';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot get all blood banks');
    }
  };
}
