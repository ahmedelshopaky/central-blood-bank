import client from '../database';

export type DonorType = {
  id?: number;
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
        'INSERT INTO donors (nationalid, name, city, email, lastdonation) VALUES ($1, $2, $3, $4, $5) RETURNING *';
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
      throw new Error('Cannot create this donor');
    }
  };
}
