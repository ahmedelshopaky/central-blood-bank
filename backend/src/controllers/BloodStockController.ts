import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BloodStockValidation } from '../validations/BloodStockValidation';
import { BloodStockModel, BloodStockType } from '../models/BloodStockModel';
import { DonorModel } from '../models/DonorModel';

const BloodStockRouter = express.Router();

enum Test {
  'POSITIVE' = 'positive',
  'NEGATIVE' = 'negative',
}

const isAccepted = (bloodVirusTest: Test, lastDonation: Date) => {
  const rejectionReasons = [];
  const differenceInMonths =
    (new Date().valueOf() - new Date(lastDonation).valueOf()) / 2592000000;
  if (bloodVirusTest !== Test.NEGATIVE) {
    rejectionReasons.push('The blood virus test must be negative');
  }
  if (differenceInMonths < 3) {
    rejectionReasons.push(
      'The time since last donation must be more than 3 month'
    );
  }
  if (rejectionReasons.length > 0) {
    return false;
  } else {
    return true;
  }
};

const getLastDonation = async (donorId: number): Promise<Date> => {
  const donor = await DonorModel.show(donorId);
  return donor['last_donation'];
};

const create = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      // check if donation isAccepted
      const lastDonation = await getLastDonation(req.body.donorId);
      if (isAccepted(req.body.bloodVirusTest, lastDonation)) {
        const bloodStockInstance: BloodStockType = {
          bloodType: req.body.bloodType,
          bankCity: req.body.bankCity,
          date: new Date(),
          donorId: req.body.donorId,
        };
        const newBloodStockInstance = await BloodStockModel.create(
          bloodStockInstance
        );

        // update last donation date
        DonorModel.update(req.body.donorId, new Date());

        res.status(201).json({
          Data: newBloodStockInstance,
          Message: 'object',
          Success: true,
        });
      } else {
        res.status(400).json({
          Data: 'not accepted',
          Message: 'string',
          Success: false,
        });
      }
    } else {
      res.status(400).json({
        Data: errors,
        Message: 'validation errors',
        Success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

BloodStockRouter.post('/donate', BloodStockValidation, create);
export default BloodStockRouter;
