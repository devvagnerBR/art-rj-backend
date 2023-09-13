import { Request, Response } from 'express';
import { ProductsBusiness } from '../business/products-business';
import { CustomError } from '../models/custom-error';
import { FILE } from '../types/file-type';



export class ProductsController {

    constructor(
        private productsBusiness: ProductsBusiness
    ) { }

    createProduct = async ( req: Request, res: Response ) => {

        try {

            const token = req.headers.authorization as string;
            const { title, slug, description, quantity, price } = req.body;

            const book = req?.files
            await this.productsBusiness.createProduct( title, slug, description, quantity, price, book, token )
            res.status( 200 ).send( { message: "successfully created product" } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }


    }

}