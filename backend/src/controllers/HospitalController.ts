import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HospitalModel, Hospital } from '../models/HospitalModel';
import { HospitalValidation } from './validations/HospitalValidation';

const HospitalRouter = express.Router();

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

    const hospital: Hospital = {
      name: req.body.name,
      city: req.body.city,
    };
    const newHospital = await HospitalModel.create(hospital);
    res.status(201).json({
      Data: newHospital,
      Message: 'object',
      Success: true,
    });
  } catch (error) {
    next(error);
  }
};

HospitalRouter.post('/hospitals', HospitalValidation, create);
export default HospitalRouter;
