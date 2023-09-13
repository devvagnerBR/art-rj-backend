import { ProductsData } from "../data/products-data";
import { CustomError } from "../models/custom-error";
import { ProductModel } from "../models/product-model";
import { IdGenerator } from "../services/id-generator";
import { Storage } from "../services/storage";
import { FILE } from "../types/file-type";
import { Validate } from "../utils/validate";

export class ProductsBusiness {

    constructor(
        private productData: ProductsData,
        private idGenerator: IdGenerator,
        private validate: Validate,
        private storage: Storage,
    ) { }


    createProduct = async ( title: string, slug: string, description: string, quantity: number, price: number, images: FILE[], token: string ) => {

        try {

            if (
                !title ||
                !slug ||
                !description ||
                !quantity ||
                !price ||
                !images
            ) throw new CustomError( 404, "one or more fields are empty" )


            const id: string = this.idGenerator.generateId()
            const generatedImages = await this.storage.createGroupURL( images )
            if ( !generatedImages ) throw new CustomError( 404, "one or more fields are empty" )

            const tokenData = await this.validate.token( token )
            await this.productData.createProduct( new ProductModel( id, tokenData.id, title, slug, description, quantity, price, generatedImages ) )

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


    getUserProducts = async ( token: string ) => {

        try {

            const tokenData = await this.validate.token( token );
            const products = await this.productData.getUserProducts( tokenData.id );
            return products;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }
    }

    updateProduct = async ( token: string, productId: string, description?: string, price?: number, title?: string, slug?: string, quantity?: number ) => {

        try {

            if ( !productId ) throw new CustomError( 404, "product id not provided" )

            if (
                !description &&
                !price &&
                !title &&
                !slug &&
                !quantity
            ) throw new CustomError( 404, "one or more fields are empty" )

            const tokenData = await this.validate.token( token )

            console.log( title )

            const findProduct = await this.productData.getProductByProductId( productId, tokenData.id );
            if ( !findProduct ) throw new CustomError( 404, "no products were found by this id" );

            await this.productData.updateProduct( productId, quantity, description, price, title, slug );

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }
    }

    getAllActiveProducts = async ( token: string ) => {

        try {

            await this.validate.token( token );
            const activeProducts = await this.productData.getAllActiveProducts();

            return activeProducts;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }
    }


    updateMainImage = async ( token: string, productId: string, mainImage: string ) => {

        try {

            if ( !mainImage ) throw new CustomError( 404, "main image url needs to be provided" );
            const tokenData = await this.validate.token( token );
            if ( !productId ) throw new CustomError( 404, "no products were found by this id" );

            const findProduct = await this.productData.getProductByProductId( productId, tokenData.id );
            if ( !findProduct ) throw new CustomError( 404, "no products were found by this id" );

            if ( findProduct.main_image === mainImage ) throw new CustomError( 404, "informed image is already the main image" );
            await this.productData.updateMainImage( productId, mainImage )

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }
}
