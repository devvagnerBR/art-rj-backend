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

            const book = req?.files as FILE[]
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

    getUserProducts = async ( req: Request, res: Response ) => {

        try {

            const token = req.headers.authorization as string;
            const products = await this.productsBusiness.getUserProducts( token );
            res.status( 200 ).send( { data: products } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }


    updateProduct = async ( req: Request, res: Response ) => {

        try {

            const { description, price, title, slug, quantity } = req.body
            const { productId } = req.params
            const token = req.headers.authorization as string;

            await this.productsBusiness.updateProduct( token, productId, description, price, title, slug, quantity )
            res.status( 200 ).send( { message: "product updated successfully" } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }

    }

    getAllActiveProducts = async ( req: Request, res: Response ) => {

        try {

            const token = req.headers.authorization as string;
            const activeProducts = await this.productsBusiness.getAllActiveProducts( token );

            res.status( 200 ).send( { data: activeProducts } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }

    updateMainImage = async ( req: Request, res: Response ) => {

        try {

            const token = req.headers.authorization as string;
            const { main_image } = req.body
            const { productId } = req.params

            await this.productsBusiness.updateMainImage( token, productId, main_image );
            res.status( 200 ).send( { message: "main image updated successfully" } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }

}