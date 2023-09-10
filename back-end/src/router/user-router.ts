import express from "express"
import { UserBusiness } from '../business/user-business';
import { UserData } from "../data/user-data";
import { IdGenerator } from "../services/id-generator";
import { HashManager } from "../services/hash-manager";
import { Authenticator } from "../services/authenticator";
import { UserController } from "../controller/user-controller";
import multer from "multer";



const userBusiness: UserBusiness = new UserBusiness(
    new UserData(),
    new Authenticator(),
    new HashManager(),
    new IdGenerator(),
);

const userController: UserController = new UserController( userBusiness );
const upload = multer( { storage: multer.memoryStorage() } );
export const userRouter = express.Router();

userRouter.post( "/signup", userController.signup )
userRouter.post( "/login", userController.login )
userRouter.get( "/user", userController.getPublicUserById )
userRouter.patch( "/user/username", userController.updateUsername )
userRouter.post( "/user/avatar",upload.single("avatar"), userController.updateProfileImage )
