import { User } from '@prisma/client';
import { UserData } from '../data/user-data';
import { CustomError } from '../models/custom-error';
import { HashManager } from '../services/hash-manager';
import { AuthenticationData } from '../types/authenticator-type';
import { Authenticator } from './../services/authenticator';

export class Validate {

    constructor(
        private authenticator: Authenticator,
        private hashManager: HashManager,
        private userData: UserData
    ) { }

    token = async ( token: string ) => {


        const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
        if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
        if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

        return tokenData

    }

    publicUser = async ( token: string ) => {

        const user = await this.userData.getPublicUserById( token );
        if ( !user ) throw new CustomError( 404, "user not found" );

        return user;
    }

    privateUser = async ( token: string ) => {

        const user = await this.userData.getPrivateUserById( token );
        if ( !user ) throw new CustomError( 404, "user not found" );

        return user;
    }


    email = async ( email: string ) => {

        if ( !email ) throw new CustomError( 404, "email is empty" );
        if ( typeof email !== "string" ) throw new CustomError( 404, "email needs to be a string" );
        if ( !email.includes( "@gmail.com" ) ) throw new CustomError( 400, "unsupported email" );

        const hasEmail: User | null = await this.userData.getUserByEmail( email );
        if ( hasEmail ) throw new CustomError( 400, "email already registered" );

        return hasEmail

    }


    username = async ( username: string ) => {

        if ( username.length > 20 ) throw new CustomError( 404, "username can be a maximum of 20 characters" );
        if ( username.length < 3 ) throw new CustomError( 400, "username field must be greater than 3" );
        if ( typeof username !== "string" ) throw new CustomError( 404, "fields needs to be a string" );

        const hasUsername = await this.userData.getUserByUsername( username );
        if ( hasUsername ) throw new CustomError( 400, "username already registered" );



        return hasUsername
    }

    password = async ( password: string ) => {

        if ( !password ) throw new CustomError( 404, "cpf is empty" );
        if ( password.length < 6 ) throw new CustomError( 400, "Password must contain 6 characters or more" );
        const passwordRegex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if ( !passwordRegex.test( password ) ) throw new CustomError( 400, 'The password must contain an uppercase character and a number' );

        const passwordAsHash = await this.hashManager.createHash( password );
        return passwordAsHash;

    }


    cpf = async ( cpf: string ) => {

        if ( !cpf ) throw new CustomError( 404, "cpf is empty" );

        const checkCPF = await this.userData.getUserByCPF( cpf )
        if ( checkCPF ) throw new CustomError( 404, "cpf is already in use" );
        const cpfRegex = /[a-zA-Z]/;
        if ( cpf.length > 11 ) throw new CustomError( 404, "invalid cpf" );
        if ( cpfRegex.test( cpf ) ) throw new CustomError( 404, "invalid cpf" );
        if ( typeof cpf !== 'string' ) throw new CustomError( 404, "cpf must be a string" );

    }

    phoneNumber = async ( phone_number: string ) => {

        if ( !phone_number ) throw new CustomError( 404, "phone number is empty" );

        if ( phone_number.length > 14 ) throw new CustomError( 404, "invalid phone number" );
        const checkPhoneNumber = await this.userData.getUserByPhoneNumber( phone_number )
        if ( checkPhoneNumber ) throw new CustomError( 404, "phone number is already in use" );

        const phoneNumberRegex = /[a-zA-Z]/;
        if ( phoneNumberRegex.test( phone_number ) ) throw new CustomError( 404, "invalid phone number" );
        if ( typeof phone_number !== 'string' ) throw new CustomError( 404, "phone number must be a string" );

    }


}