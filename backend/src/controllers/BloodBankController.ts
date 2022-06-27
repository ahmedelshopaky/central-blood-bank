import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BloodBank, BloodBankModel } from '../models/BloodBankModel';
import { BloodBankHospitalValidation } from './validations/BloodBankHospitalValidation';
import getDistance from 'geolib/es/getDistance';
import { HospitalModel } from '../models/HospitalModel';
import { CitiesDistanceModel } from '../models/CitiesDistanceModel';

const BloodBankRouter = express.Router();

// const getDistance = (
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ) => {
//   const R = 6371; // Radius of the earth in km
//   const dLat = lat2 - lat1;
//   const dLon = lon2 - lon1;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c; // Distance in km
//   return d;
// };

const setDistance = async (bloodBank: BloodBank): Promise<void> => {
  const hospitals = await HospitalModel.getAll();
  for (const hospital of hospitals) {
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

    const bloodBank: BloodBank = {
      name: req.body.name,
      city: req.body.city,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };
    const newBloodBank = await BloodBankModel.create(bloodBank);
    setDistance(newBloodBank); // set distance for all hospitals
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

BloodBankRouter.post('/blood-banks', BloodBankHospitalValidation, create);
BloodBankRouter.get('/blood-banks', getAll);
export default BloodBankRouter;
