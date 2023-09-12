import express from "express"
import { UserData } from "../data/user-data";
import { IdGenerator } from "../services/id-generator";
import { HashManager } from "../services/hash-manager";
import { Authenticator } from "../services/authenticator";
import { Validate } from "../utils/validate";
import { ProductsBusiness } from '../business/products-business';
import { ProductsData } from "../data/products-data";
import { ProductsController } from "../controller/products-controller";



const productsBusiness: ProductsBusiness = new ProductsBusiness(

    new ProductsData(),
    new IdGenerator(),
    new Validate( new Authenticator(), new HashManager(), new UserData() )

);

const productsController: ProductsController = new ProductsController( productsBusiness );

export const productsRouter = express.Router();
productsRouter.post( "/signup", productsController.createProduct )
