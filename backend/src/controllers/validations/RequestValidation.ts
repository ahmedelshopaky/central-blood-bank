import { body } from 'express-validator';

export const RequestValidation = [
  // patientStatus validation
  body('patientStatus')
    .isIn(['immediate', 'urgent', 'normal'])
    .withMessage('Invalid patient status value'),
  // bloodType validation
  body('bloodType')
    .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .withMessage('Invalid blood type value'),
  // quantity validation
  body('quantity').isInt().withMessage('Invalid quantity'),

  // TODO hospitalId validation
  body('hospitalId').isInt().withMessage('Invalid id'),
];
