import { UserData } from '../data/user-data';
import { CustomError } from '../models/custom-error';
import { USER_DTO } from '../types/user-dto';
import { Authenticator } from '../services/authenticator';
import { HashManager } from '../services/hash-manager';
import { UserModel } from '../models/user-model';
import { IdGenerator } from '../services/id-generator';
import { Storage } from '../services/storage';
import { FILE } from '../types/file-type';
import { Email } from '../services/nodemailer';
import { Validate } from '../utils/validate';


export class UserBusiness {

    constructor(
        private storage: Storage,
        private userData: UserData,
        private authenticator: Authenticator,
        private hashManager: HashManager,
        private idGenerator: IdGenerator,
        private email: Email,
        private validate: Validate

    ) { }

    signup = async ( user: USER_DTO ) => {

        try {

            const { username, email, birthday, password } = user;

            await this.validate.username( username );
            await this.validate.email( email );
            const passwordAsHash = await this.validate.password( password );

            const id: string = this.idGenerator.generateId()
            await this.userData.signup( new UserModel( id, username.toLowerCase(), email, passwordAsHash, birthday ) );

            const token: string = this.authenticator.generateToken( { id: id } )
            return token;

            // if ( !username || !password || !email || !birthday ) throw new CustomError( 404, "one or more fields are empty" );

            // if ( username.length > 20 ) throw new CustomError( 404, "username can be a maximum of 20 characters" );
            // if ( username.length < 3 ) throw new CustomError( 400, "username field must be greater than 3" );
            // if ( password.length < 6 ) throw new CustomError( 400, "Password must contain 6 characters or more" );
            // if ( typeof username !== "string" || typeof email !== "string" || typeof birthday !== "string" ) throw new CustomError( 404, "fields needs to be a string" );
            // if ( !email.includes( "@gmail.com" ) ) throw new CustomError( 400, "unsupported email" );

            // const passwordRegex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            // if ( !passwordRegex.test( password ) ) throw new CustomError( 400, 'The password must contain an uppercase character and a number' );

            // const passwordAsHash = await this.hashManager.createHash( password );

            // const hasUsername = await this.userData.getUserByUsername( username )
            // if ( hasUsername ) throw new CustomError( 400, "username already registered" );

            // const hasEmail = await this.userData.getUserByEmail( email )
            // if ( hasEmail ) throw new CustomError( 400, "email already registered" );

            // const id: string = this.idGenerator.generateId()
            // await this.userData.signup( new UserModel( id, username.toLowerCase(), email, passwordAsHash, birthday ) );

            // const token: string = this.authenticator.generateToken( { id: id } )
            // return token;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }

    login = async ( email: string, password: string ) => {

        try {


            if ( !email || !password ) throw new CustomError( 400, 'one or more fields are empty' );
            if ( !email.includes( "@gmail.com" ) ) throw new CustomError( 400, "enter a valid email address" );

            const user = await this.userData.getUserByEmail( email )
            if ( !user ) throw new CustomError( 403, 'user not found' );

            const validatePassword = await this.hashManager.compareHash( password, user.password );
            if ( !validatePassword ) throw new CustomError( 401, 'incorrect password' );

            const token: string = this.authenticator.generateToken( { id: user.id } );
            return token;


        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }

    getPublicUserById = async ( token: string ) => {

        try {

            // const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            // if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            // if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const tokenData = await this.validate.token( token )

            // const user = await this.userData.getPublicUserById( tokenData.id );
            // if ( !user ) throw new CustomError( 404, "user not found" );

            const user = await this.validate.publicUser( tokenData.id )
            return user;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }

    updateUsername = async ( username: string, token: string ) => {

        try {

            const tokenData = await this.validate.token( token );
            await this.validate.username( username );

            const user = await this.userData.getPrivateUserById( tokenData.id );
            if ( !user ) throw new CustomError( 404, "user not found" )

            if ( user.username === username ) throw new CustomError( 404, "new username entered is the same as the current username" );

            await this.userData.updateUsername( username, tokenData.id );

            // if ( !username || !token ) throw new CustomError( 401, "one or more values are empty" );
            // if ( !username ) throw new CustomError( 404, "new username not informed" );

            // const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            // if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            // if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            // const user = await this.userData.getPrivateUserById( tokenData.id );
            // if ( !user ) throw new CustomError( 404, "user not found" );

            // const checkUsername = await this.userData.getUserByUsername( username );

            // if ( user.username === username ) throw new CustomError( 404, "new username entered is the same as the current username" );
            // if ( checkUsername ) throw new CustomError( 409, "username already in use" );

            // if ( username.length > 20 ) throw new CustomError( 404, "username can be a maximum of 20 characters" );
            // if ( username.length < 3 ) throw new CustomError( 400, "username field must be greater than 3" );
            // if ( typeof username !== "string" ) throw new CustomError( 404, "fields needs to be a string" );

            // await this.userData.updateUsername( username, tokenData.id );

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }
    }

    updateProfileImage = async ( avatar: FILE, token: string ) => {

        try {

            if ( !avatar ) throw new CustomError( 401, "file field is empty" );

            const tokenData = await this.validate.token( token );
            await this.validate.privateUser( tokenData.id );
            const url = await this.storage.createImageURL( avatar, `avatars/${tokenData.id}` );
            await this.userData.updateProfileImage( url, tokenData.id );

            // if ( !avatar ) throw new CustomError( 401, "file field is empty" );

            // const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            // if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            // if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            // const user = await this.userData.getPrivateUserById( tokenData.id );
            // if ( !user ) throw new CustomError( 404, "user not found" );

            // const url = await this.storage.createImageURL( avatar, `avatars/${tokenData.id}` )
            // await this.userData.updateProfileImage( url, tokenData.id )

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


    sendValidateAccount = async ( token: string ) => {

        try {

            const tokenData = await this.validate.token( token );
            const user = await this.validate.privateUser( tokenData.id );

            const code = await this.email.generateCode();
            await this.email.sendValidate( user.email, code );
            return code;

            // const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            // if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            // if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            // const user = await this.userData.getPrivateUserById( tokenData.id );
            // if ( !user ) throw new CustomError( 404, "user not found" );

            // const code = await this.email.generateCode();
            // await this.email.sendValidate( user.email, code );

            // return code

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


    validateAccount = async ( code: string, confirmationCode: string, token: string, ) => {

        try {

            const tokenData = await this.validate.token( token );
            await this.validate.privateUser( tokenData.id );

            if ( !code || !confirmationCode ) throw new CustomError( 409, 'one or more fields are empty' );


            // const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            // if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            // if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            // const user = await this.userData.getPrivateUserById( tokenData.id );
            // if ( !user ) throw new CustomError( 404, "user not found" );

            // if ( !code || !confirmationCode ) throw new CustomError( 409, 'one or more fields are empty' );

            // const validate = await this.email.validateCode( code, confirmationCode );
            // if ( !validate ) throw new CustomError( 404, "token needs to be a string" );

            // await this.userData.validateAccount( tokenData.id )

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


    changePassword = async ( currentPassword: string, newPassword: string, token: string ) => {

        try {

            const tokenData = await this.validate.token( token );
            if ( !currentPassword || !newPassword ) throw new CustomError( 409, 'one or more fields are empty' );
            const user = await this.validate.privateUser( tokenData.id )
            const newPasswordAsHash = await this.validate.password( newPassword );

            const validatePassword = await this.hashManager.compareHash( currentPassword, user.password )
            if ( !validatePassword ) throw new CustomError( 401, 'incorrect password' );

            await this.userData.changePassword( newPasswordAsHash, tokenData.id );
            // const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            // if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            // if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            // if ( !currentPassword || !newPassword ) throw new CustomError( 409, 'one or more fields are empty' );

            // if ( newPassword.length > 20 ) throw new CustomError( 404, "password can be a maximum of 20 characters" );
            // if ( newPassword.length < 3 ) throw new CustomError( 400, "password field must be greater than 3" );
            // if ( newPassword.length < 6 ) throw new CustomError( 400, "password must contain 6 characters or more" );

            // const passwordRegex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            // if ( !passwordRegex.test( newPassword ) ) throw new CustomError( 400, 'The password must contain an uppercase character and a number' );

            // const user = await this.userData.getPrivateUserById( tokenData.id );
            // if ( !user ) throw new CustomError( 404, "user not found" );

            // const passwordAsHash = await this.hashManager.createHash( newPassword );

            // const validatePassword = await this.hashManager.compareHash( currentPassword, user.password )
            // if ( !validatePassword ) throw new CustomError( 401, 'incorrect password' );

            // await this.userData.changePassword( passwordAsHash, tokenData.id );

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


    updateUser = async ( token: string, cpf?: string, phone_number?: string ) => {

        try {

            if ( !cpf && !phone_number ) throw new CustomError( 404, "at least one field must be informed" );

            const tokenData = await this.validate.token( token )

            const user = await this.userData.getPrivateUserById( tokenData.id );

            if ( !user ) throw new CustomError( 404, "user not found" );
            if ( cpf ) await this.validate.cpf( cpf )
            if ( phone_number ) await this.validate.phoneNumber( phone_number )

            await this.userData.updateUser( tokenData.id, phone_number, cpf );

            // if ( !cpf && !phone_number ) throw new CustomError( 404, "at least one field must be informed" );

            // const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            // if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            // if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            // const user = await this.userData.getPrivateUserById( tokenData.id );
            // if ( !user ) throw new CustomError( 404, "user not found" );

            // if ( cpf ) {

            //     const checkCPF = await this.userData.getUserByCPF( cpf )
            //     if ( checkCPF ) throw new CustomError( 404, "cpf is already in use" );

            //     const cpfRegex = /[a-zA-Z]/;
            //     if ( cpf.length > 11 ) throw new CustomError( 404, "invalid cpf" );
            //     if ( cpfRegex.test( cpf ) ) throw new CustomError( 404, "invalid cpf" );
            //     if ( typeof cpf !== 'string' ) throw new CustomError( 404, "cpf must be a string" );

            // }

            // if ( phone_number ) {

            //     const checkPhoneNumber = await this.userData.getUserByPhoneNumber( phone_number )
            //     if ( checkPhoneNumber ) throw new CustomError( 404, "phone number is already in use" );

            //     const phoneNumberRegex = /[a-zA-Z]/;
            //     if ( phoneNumberRegex.test( phone_number ) ) throw new CustomError( 404, "invalid phone number" );
            //     if ( typeof phone_number !== 'string' ) throw new CustomError( 404, "phone number must be a string" );

            // }


            // await this.userData.updateUser( tokenData.id, phone_number, cpf );

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }
    }


}
