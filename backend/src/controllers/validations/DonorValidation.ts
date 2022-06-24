import { body, CustomValidator } from 'express-validator';
import client from '../../database';

export const getRow = async (table: string, metadata: string, data: string) => {
  const conn = await client.connect();
  const sql = `SELECT * FROM ${table} WHERE ${metadata} = '${data}'`;
  const result = await conn.query(sql);
  conn.release();
  return result.rows[0];
};

const isEmailExists: CustomValidator = async (value) => {
  const row = await getRow('donors', 'email', value);
  if (row) {
    return Promise.reject('E-mail already in use');
  }
};

const isNationalIdExists: CustomValidator = async (value) => {
  const row = await getRow('donors', 'national_id', value);
  if (row) {
    return Promise.reject('National ID already in use');
  }
};

export const DonorValidation = [
  // nationalId validation
  body('nationalId')
    .matches(
      /(2|3)[0-9][1-9][0-1][1-9][0-3][1-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d/,
      'i'
    )
    .withMessage('Invalid national id.')
    .custom(isNationalIdExists),
  // name validation
  body('name')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name must be alphabets only.')
    .isLength({ max: 50 })
    .withMessage('Name must be 50 letters max.'),
  // city validation
  body('city')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('City must be alphabets only.')
    .isLength({ max: 50 })
    .withMessage('City must be 50 letters max.'),
  // email validation
  body('email').isEmail().withMessage('Invalid email.').custom(isEmailExists),
  // lastDonation validation
  body('lastDonation').isDate().withMessage('Invalid donation date.'),
];
