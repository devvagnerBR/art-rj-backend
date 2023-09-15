import express from "express"
import { UserData } from "../data/user-data";
import { IdGenerator } from "../services/id-generator";
import { HashManager } from "../services/hash-manager";
import { Authenticator } from "../services/authenticator";
import { Validate } from "../utils/validate";
import { ProductsBusiness } from '../business/products-business';
import { ProductsData } from "../data/products-data";
import { ProductsController } from "../controller/products-controller";
import { Storage } from "../services/storage";
import multer from "multer";
import { StripeAPI } from "../services/stripe";


const productsBusiness: ProductsBusiness = new ProductsBusiness(

    new ProductsData(),
    new IdGenerator(),
    new Validate( new Authenticator(), new HashManager(), new UserData() ),
    new Storage(),
    new StripeAPI()

);

const productsController: ProductsController = new ProductsController( productsBusiness );

const upload = multer( { storage: multer.memoryStorage(), limits: { fieldSize: 10000000 } } );

export const productsRouter = express.Router();
productsRouter.post( "/product/image", upload.array( "book", 5 ), productsController.createProduct )
productsRouter.get( "/user/products", productsController.getUserProducts )
productsRouter.patch( "/product/:productId", productsController.updateProduct )
productsRouter.get( "/products/active", productsController.getAllActiveProducts )
productsRouter.patch( "/products/update-main-image/:productId", productsController.updateMainImage )


