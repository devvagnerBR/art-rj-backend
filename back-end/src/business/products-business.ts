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


    createProduct = async ( title: string, slug: string, description: string, quantity: number, price: number, images: any, token: string ) => {

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

}