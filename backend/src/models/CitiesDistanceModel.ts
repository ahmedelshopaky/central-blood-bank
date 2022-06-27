import client from '../database';

export type CitiesDistance = {
  id?: number; // PK
  hospitalId: number; // FK
  bloodBankId: number; // FK
  distance: number;
};

export class CitiesDistanceModel {
  static create = async (
    citiesDistance: CitiesDistance
  ): Promise<CitiesDistance> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO cities_distances (hospital_id, blood_bank_id, distance) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [
        citiesDistance.hospitalId,
        citiesDistance.bloodBankId,
        citiesDistance.distance,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot create this distance');
    }
  };
}
