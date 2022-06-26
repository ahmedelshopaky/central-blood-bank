import { body, CustomValidator } from 'express-validator';
import { getRow } from './DonorValidation';

const isNameExists: CustomValidator = async (value) => {
  const row = await getRow('blood_banks', 'name', value);
  if (row) {
    return Promise.reject('Blood bank name already in use');
  }
};

export const BloodBankValidation = [
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
];
