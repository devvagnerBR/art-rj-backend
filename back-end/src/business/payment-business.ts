import { CustomError } from "../models/custom-error"
import { stripe } from "../services/stripe"
import { PaymentData } from '../data/payment-data';
import { PaymentModel } from "../models/payment-model";
import { Validate } from "../utils/validate";


export class PaymentBusiness {

    constructor(
        private paymentData: PaymentData,
        private validate: Validate
    ) { }

    webhook = async ( event: any, token: string ) => {

        try {

            switch ( event.type ) {

                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    const customerId = paymentIntent.customer;
                    const customer: any = await stripe.customers.retrieve( customerId );

                    const payment: { id: string, metadata: { username: string, productId: string }, email: string, created_at: number, name: string, price: number } = {

                        id: customer.id,
                        metadata: customer.metadata,
                        email: customer.email,
                        created_at: customer.created,
                        name: customer.name,
                        price: paymentIntent.amount / 100

                    };
    
                    const tokenData = await this.validate.token( token )
                    await this.paymentData.savePayment( new PaymentModel( payment.id, payment.metadata.productId, tokenData.id ) )
                    break;

                default: console.log( `Unhandled event type ${event.type}` );

            }

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


}