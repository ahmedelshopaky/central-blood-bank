import client from '../database';

export type DonorType = {
  id?: number; // PK
  nationalId: string;
  name: string;
  city: string;
  email: string;
  lastDonation: Date;
};

export class DonorModel {
  static create = async (donor: DonorType): Promise<DonorType> => {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO donors (national_id, name, city, email, last_donation) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const result = await conn.query(sql, [
        donor.nationalId,
        donor.name,
        donor.city,
        donor.email,
        donor.lastDonation,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot create this donor');
    }
  };

  static show = async (donorId: number): Promise<DonorType> => {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM donors WHERE id=($1)';
      const result = await conn.query(sql, [donorId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot get this donor');
    }
  };

  static update = async (
    donorId: number,
    lastDonation: Date
  ): Promise<DonorType> => {
    try {
      const conn = await client.connect();
      const sql =
        'UPDATE donors SET last_donation = ($1) WHERE id = ($2) RETURNING *';
      const result = await conn.query(sql, [lastDonation, donorId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      console.log(error + '');
      throw new Error('cannot get this donor');
    }
  };
}
