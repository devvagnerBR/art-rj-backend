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
                    main_image: product.getMainImage(),

                }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }


    }

    getUserProducts = async ( token: string ) => {

        try {

            const products = await PRISMA_CLIENT.product.findMany( {
                where: { owner_id: token, is_available: true }
            } )

            return products;

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }

    updateProduct = async ( productId: string, quantity?: number, description?: string, price?: number, title?: string, slug?: string ) => {

        try {

            await PRISMA_CLIENT.product.update( {
                where: { id: productId },
                data: {
                    description: description || undefined,
                    slug: slug || undefined,
                    price: price || undefined,
                    title: title || undefined,
                    quantity: quantity || undefined
                }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }


    getProductByProductId = async ( productId: string, token: string ) => {

        try {

            const products = await PRISMA_CLIENT.product.findFirst( {
                where: { id: productId, owner_id: token },
            } )

            return products;

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }

    getAllActiveProducts = async () => {

        try {

            const activeProducts = await PRISMA_CLIENT.product.findMany( {
                where: { is_available: true }
            } )

            return activeProducts;

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }


    updateMainImage = async ( productId: string, mainImage: string ) => {

        try {

            await PRISMA_CLIENT.product.update( {
                where: { id: productId },
                data: { main_image: mainImage }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

}