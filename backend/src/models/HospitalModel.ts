import client from '../database';

export type Hospital = {
  id?: number; // PK
  name: string;
  city: string;
};

export class HospitalModel {
  static create = async (hospital: Hospital): Promise<Hospital> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO hospitals (name, city) VALUES ($1, $2) RETURNING *';
      const result = await conn.query(sql, [hospital.name, hospital.city]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot create this hospital');
    }
  };
}
