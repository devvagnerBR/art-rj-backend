import express from 'express';
import { PaymentBusiness } from '../business/payment-business';
import { PaymentController } from '../controller/payment-controller';
import { PaymentData } from '../data/payment-data';
import { UserData } from '../data/user-data';
import { StripeAPI } from '../services/stripe';
import { Validate } from '../utils/validate';
import { Authenticator } from '../services/authenticator';
import { HashManager } from '../services/hash-manager';


export const paymentRouter = express.Router()

const paymentBusiness: PaymentBusiness = new PaymentBusiness(
    new PaymentData(),
    new UserData(),
    new StripeAPI(),
    new Validate( new Authenticator(), new HashManager(), new UserData() )
)

const paymentController: PaymentController = new PaymentController( paymentBusiness )

paymentRouter.post( "/webhook", express.raw( { type: "application/json" } ), paymentController.webhook )
paymentRouter.post( "/pagar/:productId", paymentController.createPayment )