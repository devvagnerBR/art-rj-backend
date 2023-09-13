import { PRISMA_CLIENT } from "./prisma";
import { ProductModel } from "../models/product-model";

export class ProductsData {

    createProduct = async ( product: ProductModel ) => {

        try {

            await PRISMA_CLIENT.product.create( {

                data: {

                    id: product.getId(),
                    owner_id: product.getOwner_id(),
                    title: product.getTitle(),
                    slug: product.getSlug(),
                    description: product.getDescription(),
                    quantity: product.getQuantity(),
                    price: product.getPrice(),
                    images: product.getImages(),

                }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }


    }

    getUserProducts = async ( token: string ) => {

        try {

            const products = await PRISMA_CLIENT.product.findMany( {
                where: { owner_id: token }
            } )

            return products;

        } catch ( error: any ) {
            throw new Error( error.message )
        }



    }


}