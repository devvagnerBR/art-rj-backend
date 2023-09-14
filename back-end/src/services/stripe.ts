import Stripe from 'stripe';
import express from 'express';

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

    createPayment = async ( priceId: string, productId: string ) => {


        try {

            const customer = await stripe.customers.create( {
                email: "devvagnerbr@gmail.com",
                name: "devvagner",
                metadata: { username: "devvagner", productId }

            } )

            const session = await stripe.checkout.sessions.create( {

                line_items: [
                    {
                        price: priceId,
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
            console.error( 'Erro ao criar o produto:', error );
        }

    }





} 