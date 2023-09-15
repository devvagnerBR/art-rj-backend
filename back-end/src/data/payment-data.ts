import { PaymentModel } from "../models/payment-model"
import { PRISMA_CLIENT } from "./prisma"

export class PaymentData {


    savePayment = async ( payment: PaymentModel ) => {

        try {

            await PRISMA_CLIENT.purchase.create( {
                data: {
                    id: payment.getId(),
                    user_id: payment.getUserId(),
                    product_id: payment.getProductId(),
                }
            } )


        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

    getPaymentHistory = async ( token: string ) => {

        try {

            const products = await PRISMA_CLIENT.purchase.findMany( {
                where: { user_id: token },
                include: {
                    product: {}
                }


            } )

            return products
        } catch ( error: any ) {
            throw new Error( error.message )
        }


    }

}