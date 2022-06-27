import { body } from 'express-validator';

export const BloodStockValidation = [
  // bloodType validation
  body('bloodType')
    .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .withMessage('Invalid blood type value'),
  // TODO bloodBankId validation
  // body('bloodBankId').isInt().withMessage('Invalid id'),
  // expirationDate validation
  // body('expirationDate').not().isDate().withMessage('Invalid date.'),
  // TODO donorNationalId validation
  body('nationalId')
    .matches(
      /^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/,
      'i'
    )
    .withMessage('Invalid national id.'),

  // bloodVirusTest validation
  body('bloodVirusTest')
    .optional()
    .isIn(['positive', 'negative'])
    .withMessage('Invalid blood virus test'),
];
