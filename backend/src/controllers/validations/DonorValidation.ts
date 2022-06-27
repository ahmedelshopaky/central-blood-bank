import { body, CustomValidator, param } from 'express-validator';
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

export const NationalIdValidation = [
  param('nationalId')
    .matches(
      /^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/,
      'i'
    )
    .withMessage('Invalid national id.'),
];

export const DonorValidation = [
  // nationalId validation
  body('nationalId')
    .matches(
      /^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/,
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
    .optional()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('City must be alphabets only.')
    .isLength({ max: 50 })
    .withMessage('City must be 50 letters max.'),
  // email validation
  body('email').isEmail().withMessage('Invalid email.').custom(isEmailExists),
  // lastDonation validation
  body('lastDonation')
    .optional()
    .isDate()
    .withMessage('Invalid donation date.'),
  // bloodType validation
  body('bloodType')
    .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .withMessage('Invalid blood type value'),
];
