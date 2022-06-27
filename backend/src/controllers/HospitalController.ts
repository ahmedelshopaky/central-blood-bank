import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HospitalModel, Hospital } from '../models/HospitalModel';
import { BloodBankHospitalValidation } from './validations/BloodBankHospitalValidation';
import getDistance from 'geolib/es/getDistance';
import { BloodBankModel } from '../models/BloodBankModel';
import { CitiesDistanceModel } from '../models/CitiesDistanceModel';

const HospitalRouter = express.Router();

const setDistance = async (hospital: Hospital): Promise<void> => {
  const bloodBanks = await BloodBankModel.getAll();
  for (const bloodBank of bloodBanks) {
    const distance = getDistance(
      { latitude: bloodBank.latitude, longitude: bloodBank.longitude },
      { latitude: hospital.latitude, longitude: hospital.longitude }
    );
    const citiesDistance = {
      hospitalId: hospital.id as number,
      bloodBankId: bloodBank.id as number,
      distance: distance,
    };
    CitiesDistanceModel.create(citiesDistance);
  }
};

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
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };
    const newHospital = await HospitalModel.create(hospital);
    setDistance(newHospital); // set distance for all blood banks
    res.status(201).json({
      Data: newHospital,
      Message: 'object',
      Success: true,
    });
  } catch (error) {
    next(error);
  }
};

HospitalRouter.post('/hospitals', BloodBankHospitalValidation, create);
export default HospitalRouter;
