import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BloodBank, BloodBankModel } from '../models/BloodBankModel';
import { BloodBankValidation } from './validations/BloodBankValidation';

const BloodBankRouter = express.Router();

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

    const bloodBank: BloodBank = {
      name: req.body.name,
      city: req.body.city,
    };
    const newBloodBank = await BloodBankModel.create(bloodBank);
    res.status(201).json({
      Data: newBloodBank,
      Message: 'object',
      Success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bloodBanks = await BloodBankModel.getAll();
    res.status(200).json({
      Data: bloodBanks,
      Message: 'array',
      Success: true,
    });
  } catch (error) {
    next(error);
  }
};

BloodBankRouter.post('/blood-banks', BloodBankValidation, create);
BloodBankRouter.get('/blood-banks', getAll);
export default BloodBankRouter;
