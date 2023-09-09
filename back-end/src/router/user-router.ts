import express from "express"
import { USER_BUSINESS } from '../business/user-business';
import { USER_DATA } from "../data/user-data";
import { IdGenerator } from "../services/id-generator";
import { HashManager } from "../services/hash-manager";
import { Authenticator } from "../services/authenticator";
import { USER_CONTROLLER } from "../controller/user-controller";

const userBusiness: USER_BUSINESS = new USER_BUSINESS(
    new USER_DATA(),
    new Authenticator(),
    new HashManager(),
    new IdGenerator(),
);

const userController: USER_CONTROLLER = new USER_CONTROLLER( userBusiness );
export const userRouter = express.Router();

userRouter.post( "/signup", userController.signup )
