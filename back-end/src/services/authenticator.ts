import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticationData } from '../types/authenticator-type';
import { CustomError } from '../models/custom-error';




dotenv.config();

export class Authenticator {


    generateToken = ( payload: AuthenticationData ) => {
        return jwt.sign( payload, process.env.JWT_KEY as jwt.Secret, {
            expiresIn: process.env.JWT_EXPIRES
        } )
    }

    getTokenData = ( token: string ) => {

        try {

            return jwt.verify(
                token,
                process.env.JWT_KEY as jwt.Secret
            ) as AuthenticationData


        } catch ( error: any ) {
            if ( error.name === 'TokenExpiredError' ) {
                throw new CustomError( 409, 'Expired token, login again' );
            } else if ( error.name === 'JsonWebTokenError' ) {
                throw new CustomError( 409, 'Invalid token, login again' );
            } else {
                throw new CustomError( 404, 'Unknown validation error, login again' );
            }
        }

    }
}