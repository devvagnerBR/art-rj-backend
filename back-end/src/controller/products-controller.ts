import { Request, Response } from 'express';
import { ProductsBusiness } from '../business/products-business';



export class ProductsController {

    constructor(
        private productsBusiness: ProductsBusiness
    ) { }

    createProduct = async ( req: Request, res: Response ) => {

        const token = req.headers.authorization as string;
        const { title, slug, description, quantity, price, images } = req.body;
        await this.productsBusiness.createProduct( title, slug, description, quantity, price, images, token )
        res.status( 200 ).send( { message: "successfully created product"})

    }

}