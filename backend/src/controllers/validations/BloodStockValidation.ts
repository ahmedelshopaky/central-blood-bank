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
  body('donorNationalId')
    .matches(
      /(2|3)[0-9][1-9][0-1][1-9][0-3][1-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d/,
      'i'
    )
    .withMessage('Invalid national id.'),

  // bloodVirusTest validation
  body('bloodVirusTest')
    .optional()
    .isIn(['positive', 'negative'])
    .withMessage('Invalid blood virus test'),
];
