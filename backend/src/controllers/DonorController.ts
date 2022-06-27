import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { DonorModel, Donor } from '../models/DonorModel';
import {
  DonorValidation,
  NationalIdValidation,
} from './validations/DonorValidation';

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

    const donor: Donor = {
      nationalId: req.body.nationalId,
      name: req.body.name,
      city: req.body.city,
      email: req.body.email,
      lastDonation: req.body.lastDonation,
      bloodType: req.body.bloodType,
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

const getByNationalId = async (
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

    const nationalId = req.params.nationalId;
    const donor = await DonorModel.get(nationalId);
    if (donor) {
      res.status(200).json({
        Data: donor,
        Message: 'object',
        Success: true,
      });
    } else {
      res.status(200).json({
        Data: null,
        Message: 'not found',
        Success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

DonorRouter.post('/register', DonorValidation, create);
DonorRouter.get('/donor/:nationalId', NationalIdValidation, getByNationalId);
export default DonorRouter;
