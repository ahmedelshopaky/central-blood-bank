import express, { NextFunction } from 'express';
import { DonorModel, DonorType } from '../models/DonorModel';

const DonorRouter = express.Router();

export const create = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
): Promise<void> => {
  try {
    const donor: DonorType = {
      nationalId: req.body.nationalId,
      name: req.body.name,
      city: req.body.city,
      email: req.body.email,
      lastDonation: req.body.lastDonation,
    };
    const newDonor = await DonorModel.create(donor);
    res.json({
      Data: {
        newDonor,
      },
      Message: 'object',
      Success: true,
      // IsAuthorized: true,
    });
  } catch (error) {
    next(error);
  }
};

DonorRouter.post('/donors', create);
export default DonorRouter;
