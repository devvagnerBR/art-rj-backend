import { UserBusiness } from '../business/user-business';
import { Request, Response } from 'express';
import { CustomError } from '../models/custom-error';
import { USER_DTO } from '../types/user-dto';
import { FILE } from '../types/file-type';



export class UserController {

    constructor(
        private userBusiness: UserBusiness
    ) { }

    signup = async ( req: Request, res: Response ) => {

        try {

            const { username, email, birthday, password } = req.body;
            const newUser: USER_DTO = { username, email, birthday, password }

            const result = await this.userBusiness.signup( newUser );
            res.status( 200 ).send( { message: "user created successfully", token: result } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }


    login = async ( req: Request, res: Response ) => {

        try {

            const { email, password } = req.body;
            const result = await this.userBusiness.login( email, password );
            res.status( 200 ).send( { data: result } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }

    }

    getPublicUserById = async ( req: Request, res: Response ) => {

        try {

            const token = req.headers.authorization as string;
            const result = await this.userBusiness.getPublicUserById( token );
            res.status( 200 ).send( result );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }

    }

    updateUsername = async ( req: Request, res: Response ) => {

        try {

            const { username } = req.body;
            const token = req.headers.authorization as string;
            await this.userBusiness.updateUsername( username, token );
            res.status( 200 ).send( { message: "user updated successfully" } );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }

    }

    updateProfileImage = async ( req: Request, res: Response ) => {

        try {

            const avatar = req?.file as FILE
            const token = req.headers.authorization as string;

            await this.userBusiness.updateProfileImage( avatar, token )

            res.status( 200 ).send( { message: "profile image updated successfully" } );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }

    sendValidateAccount = async ( req: Request, res: Response ) => {

        try {

            const token = req.headers.authorization as string;

            const code = await this.userBusiness.sendValidateAccount( token )
            res.status( 200 ).send( { message: "validation code send successfully", code } );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }


    validateAccount = async ( req: Request, res: Response ) => {

        try {

            const { code, confirmationCode } = req.body;
            const token = req.headers.authorization as string;

            await this.userBusiness.validateAccount( code, confirmationCode, token )
            res.status( 200 ).send( { message: "account validated successfully" } );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( 404 ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }
}