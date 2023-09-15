import { CustomError } from "../models/custom-error"
import { stripe, StripeAPI } from '../services/stripe';
import { PaymentData } from '../data/payment-data';
import { PaymentModel } from "../models/payment-model";
import { UserData } from "../data/user-data";
import { User } from "@prisma/client";
import { Validate } from "../utils/validate";

export class PaymentBusiness {

    constructor(
        private paymentData: PaymentData,
        private userData: UserData,
        private stripeAPI: StripeAPI,
        private validate: Validate
    ) { }

    webhook = async ( event: any ) => {

        try {

            switch ( event.type ) {

                case 'payment_intent.succeeded':

                    const paymentIntent = event.data.object;
                    const customerId = paymentIntent.customer;
                    const customer: any = await stripe.customers.retrieve( customerId );

                    const payment: { id: string, metadata: { username: string, product_id: string }, email: string, created_at: number, name: string, price: number } = {

                        id: customer.id,
                        metadata: customer.metadata,
                        email: customer.email,
                        created_at: customer.created,
                        name: customer.name,
                        price: paymentIntent.amount / 100

                    };

                    const user = await this.userData.getUserByEmail( payment.email ) as User
                    if ( !user ) throw new CustomError( 401, "user not found" )

                    await this.paymentData.savePayment( new PaymentModel( payment.id, payment.metadata.product_id, user.id ) );
                    break;

                // case 'customer.created':
                //     console.log( "customer.created 1" )
                //     break

                // case 'charge.succeeded':
                //     console.log( "charge.succeeded 2" )
                //     break

                // case 'checkout.session.completed':
                //     console.log( "checkout.session.completed" )
                //     break

                // case 'payment_intent.created':
                //     console.log( 'payment_intent.created 4' )
                //     break

                default: console.log( `Unhandled event type ${event.type}` );

            }

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


    createPayment = async ( productId: string, token: string ) => {

        try {

            if ( !productId ) throw new CustomError( 404, "product not found" );
            
            const tokenData = await this.validate.token( token )
            const user = await this.validate.privateUser( tokenData.id );

            const priceId = await this.stripeAPI.getProductById( productId ) as string;

            const config = {

                price_id: priceId,
                product_id: productId,
                user_email: user.email,
                username: user.username,

            }

            const result = await this.stripeAPI.createPayment( config );

            if ( result ) return result.url;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


}