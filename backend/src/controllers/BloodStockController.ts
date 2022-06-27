import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { BloodStockValidation } from './validations/BloodStockValidation';
import { BloodStockModel, BloodStock } from '../models/BloodStockModel';
import { Donor, DonorModel } from '../models/DonorModel';

const BloodStockRouter = express.Router();

const MONTH = 1000 * 60 * 60 * 24 * 30;
enum Test {
  'POSITIVE' = 'positive',
  'NEGATIVE' = 'negative',
}

dotenv.config();
const { MAIL_USER, MAIL_PASSWORD, MAIL_HOST } = process.env;

const sendEmail = (subject: string, text: string, donorEmail: string) => {
  const transporter = nodemailer.createTransport({
    service: MAIL_HOST,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: MAIL_USER,
    to: donorEmail,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const isAccepted = (bloodVirusTest: Test, lastDonation: Date): string[] => {
  const rejectionReasons: string[] = [];
  const differenceInMonths =
    (new Date().valueOf() - new Date(lastDonation).valueOf()) / MONTH;
  if (bloodVirusTest !== Test.NEGATIVE) {
    rejectionReasons.push('The blood virus test must be negative');
  }
  if (differenceInMonths < 3) {
    rejectionReasons.push(
      'The time since last donation must be more than 3 month'
    );
  }
  if (rejectionReasons.length > 0) {
    return rejectionReasons;
  } else {
    return rejectionReasons;
  }
};

const create = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const donor: any = await DonorModel.get(req.body.nationalId);
      if (donor) {
        // check if donation isAccepted
        const rejectionReasons = isAccepted(
          req.body.bloodVirusTest,
          donor['last_donation']
        );
        if (rejectionReasons.length > 0) {
          // sendEmail(
          //   'Donation is rejected',
          //   `Hi ${
          //     donor['name']
          //   },\n\nThank you for your donation. We have carefully checked your donation and we'd like to inform you that your donation is rejected beacaue of the following reasons:\n${rejectionReasons.map(
          //     (value, index) => {
          //       return `\n${index + 1}. ${value}`;
          //     }
          //   )}.`,
          //   donor['email']
          // );
          res.status(200).json({
            Data: rejectionReasons,
            Message: 'not accepted',
            Success: false,
          });
        } else {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 45); // 45 days from now

          const bloodStockInstance: BloodStock = {
            bloodType: req.body.bloodType,
            bloodBankId: req.body.bloodBankId,
            expirationDate: expirationDate,
            donorNationalId: req.body.nationalId,
          };

          // create a new blood stock instance
          const newBloodStockInstance = await BloodStockModel.create(
            bloodStockInstance
          );

          // update last donation date
          DonorModel.update(req.body.nationalId);

          // send acceptance email
          // sendEmail(
          //   'Donation is accepted',
          //   `Hi ${donor['name']},\n\nThank you for your donation. We have carefully checked your donation and we'd like to inform you that your donation is accepted.`,
          //   donor['email']
          // );

          res.status(201).json({
            Data: newBloodStockInstance,
            Message: 'object',
            Success: true,
          });
        }
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
