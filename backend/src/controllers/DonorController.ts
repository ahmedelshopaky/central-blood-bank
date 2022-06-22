import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { DonorModel, DonorType } from '../models/DonorModel';
import { DonorValidation } from '../validations/DonorValidation';

const DonorRouter = express.Router();

const create = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        Data: errors,
        Message: 'validation errors',
        Success: false,
      });
      return;
    }

    const donor: DonorType = {
      nationalId: req.body.nationalId,
      name: req.body.name,
      city: req.body.city,
      email: req.body.email,
      lastDonation: req.body.lastDonation,
    };
    const newDonor = await DonorModel.create(donor);
    res.status(201).json({
      Data: newDonor,
      Message: 'object',
      Success: true,
    });
  } catch (error) {
    next(error);
  }
};

DonorRouter.post('/donors', DonorValidation, create);
export default DonorRouter;
