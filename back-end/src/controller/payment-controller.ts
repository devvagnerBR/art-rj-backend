import { PaymentBusiness } from "../business/payment-business";
import { Request, Response } from 'express';
import { CustomError } from "../models/custom-error";


export class PaymentController {

    constructor(
        private paymentBusiness: PaymentBusiness
    ) { }

    webhook = async ( req: Request, res: Response ) => {

        try {

            const event = req.body;
            const token = req.headers.authorization as string;
            await this.paymentBusiness.webhook( event, token );

            res.json( { received: true } );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }

}