import Stripe from 'stripe';


const SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
export const stripe = new Stripe( SECRET_KEY, { apiVersion: "2023-08-16" } )

export class StripeAPI {


    getProductById = async ( productId: string ) => {

        try {

            const product = await stripe.products.retrieve( productId );
            return product.default_price

        } catch ( error ) {
            console.error( 'Erro ao criar o produto:', error );
        }
    }


    createProduct = async ( title: string, description: string, value: number ) => {


        try {

            const product = await stripe.products.create( {
                name: title,
                default_price_data: {
                    unit_amount: value * 100,
                    currency: 'brl',
                },
                expand: ['default_price']
            } )

            return product


        } catch ( error ) {
            console.error( 'Erro ao criar o produto:', error );
        }
    }

    createPayment = async ( config: { price_id: string, product_id: string, user_email: string, username: string } ) => {


        try {

            const customer = await stripe.customers.create( {
                email: config.user_email,
                name: config.username,
                metadata: { username: config.username, product_id: config.product_id }

            } )

            const session = await stripe.checkout.sessions.create( {

                line_items: [
                    {
                        price: config.price_id,
                        quantity: 1,
                    }
                ],
                customer: customer.id,
                mode: 'payment',
                success_url: "https://www.google/com",
                cancel_url: "https://www.google/com"
            } );

            return session

        } catch ( error ) {
            console.error( 'Erro ao criar pagamento:', error );
        }

    }





} 