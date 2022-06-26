import { body } from 'express-validator';

export const RequestValidation = [
  // patientStatus validation
  body('patientStatus')
    .isIn(['immediate', 'urgent', 'normal'])
    .withMessage('Invalid patient status value'),
  // requestStatus validation
  body('requestStatus')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Invalid request status value'),
  // bloodType validation
  body('bloodType')
    .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .withMessage('Invalid blood type value'),
  // quantity validation
  body('quantity').isInt().withMessage('Invalid quantity'),

  // TODO hospitalId validation
  body('hospitalId').isInt().withMessage('Invalid id'),
  // TODO bloodStockId validation
  // body('bloodStockId').optional().isInt().withMessage('Invalid id'),
];
