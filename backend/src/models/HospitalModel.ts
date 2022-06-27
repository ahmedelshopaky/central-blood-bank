import client from '../database';

export type Hospital = {
  id?: number; // PK
  name: string;
  city: string;
  latitude: number;
  longitude: number;
};

export class HospitalModel {
  static create = async (hospital: Hospital): Promise<Hospital> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO hospitals (name, city, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [
        hospital.name,
        hospital.city,
        hospital.latitude,
        hospital.longitude,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot create this hospital');
    }
  };

  static getAll = async (): Promise<Hospital[]> => {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM hospitals';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot get all hospitals');
    }
  };
}
