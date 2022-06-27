import { body, CustomValidator } from 'express-validator';
import { getRow } from './DonorValidation';

const isNameExists: CustomValidator = async (value) => {
  if (
    (await getRow('hospitals', 'name', value)) ||
    (await getRow('blood_banks', 'name', value))
  ) {
    return Promise.reject('Name already in use');
  }
};

export const BloodBankHospitalValidation = [
  // name validation
  body('name')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('Name must be alphabets only.')
    .isLength({ max: 50 })
    .withMessage('Name must be 50 letters max.')
    .custom(isNameExists),
  // city validation
  body('city')
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('City must be alphabets only.')
    .isLength({ max: 50 })
    .withMessage('City must be 50 letters max.'),
  // latitude validation
  body('latitude').isNumeric().withMessage('Latitude must be numeric.'),
  // longitude validation
  body('longitude').isNumeric().withMessage('Longitude must be numeric.'),
];
