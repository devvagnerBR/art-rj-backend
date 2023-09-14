import express from 'express';
import { PaymentBusiness } from '../business/payment-business';
import { PaymentController } from '../controller/payment-controller';
import { PaymentData } from '../data/payment-data';
import { Validate } from '../utils/validate';
import { Authenticator } from '../services/authenticator';
import { HashManager } from '../services/hash-manager';
import { UserData } from '../data/user-data';


export const paymentRouter = express.Router()

const paymentBusiness: PaymentBusiness = new PaymentBusiness(
    new PaymentData,
    new Validate( new Authenticator(),
        new HashManager(),
        new UserData() ) )
        
const paymentController: PaymentController = new PaymentController( paymentBusiness )

paymentRouter.post( "/webhook", express.raw( { type: "application/json" } ), paymentController.webhook )
