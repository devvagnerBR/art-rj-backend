import express from "express"
import { UserBusiness } from '../business/user-business';
import { UserData } from "../data/user-data";
import { IdGenerator } from "../services/id-generator";
import { HashManager } from "../services/hash-manager";
import { Authenticator } from "../services/authenticator";
import { UserController } from "../controller/user-controller";
import multer from "multer";
import { Storage } from "../services/storage";
import { Email } from "../services/nodemailer";
import { Validate } from "../utils/validate";



const userBusiness: UserBusiness = new UserBusiness(

    new Storage(),
    new UserData(),
    new Authenticator(),
    new HashManager(),
    new IdGenerator(),
    new Email(),
    new Validate( new Authenticator(), new HashManager(), new UserData() )
);

const userController: UserController = new UserController( userBusiness );
const upload = multer( { storage: multer.memoryStorage() } );
export const userRouter = express.Router();

userRouter.post( "/signup", userController.signup )
userRouter.post( "/login", userController.login )
userRouter.get( "/user", userController.getPublicUserById )
userRouter.patch( "/user/username", userController.updateUsername )
userRouter.post( "/user/avatar", upload.single( "avatar" ), userController.updateProfileImage )

userRouter.post( "/user/confirm-account", userController.sendValidateAccount )
userRouter.post( "/user/validate-account", userController.validateAccount )
userRouter.patch( "/user/change-password", userController.changePassword )
userRouter.patch( "/user/update", userController.updateUser )

