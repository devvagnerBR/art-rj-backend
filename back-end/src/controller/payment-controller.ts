import { PaymentBusiness } from "../business/payment-business";
import { Request, Response } from 'express';
import { CustomError } from "../models/custom-error";


export class PaymentController {

    constructor(
        private paymentBusiness: PaymentBusiness
    ) { }

    webhook = async ( req: Request, res: Response ) => {

        try {

            const event = req.body
            await this.paymentBusiness.webhook( event );
            res.json( { received: true } );

        } catch ( error: any ) {
            console.log( "deu erro aqui", error )
        }
    }


    createPayment = async ( req: Request, res: Response ) => {

        try {

            const token = req.headers.authorization as string;
            const { productId } = req.params;
            const result = await this.paymentBusiness.createPayment( productId, token )
            res.status( 200 ).send( { data: result } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }

    }

    getPaymentHistory = async ( req: Request, res: Response ) => {

        try {

            const token = req.headers.authorization as string;
            const data = await this.paymentBusiness.getPaymentHistory( token );
            res.status( 200 ).send( { data } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }

    }

}