import { UserData } from '../data/user-data';
import { CustomError } from '../models/custom-error';
import { USER_DTO } from '../types/user-dto';
import { Authenticator } from '../services/authenticator';
import { HashManager } from '../services/hash-manager';
import { UserModel } from '../models/user-model';
import { IdGenerator } from '../services/id-generator';
import { AuthenticationData } from '../types/authenticator-type';
import { Storage } from '../services/storage';
import { FILE } from '../types/file-type';
import { Email } from '../services/nodemailer';

export class UserBusiness {

    constructor(
        private storage: Storage,
        private userData: UserData,
        private authenticator: Authenticator,
        private hashManager: HashManager,
        private idGenerator: IdGenerator,
        private email: Email

    ) { }

    signup = async ( user: USER_DTO ) => {

        try {

            const { username, email, birthday, password } = user;

            if ( !username || !password || !email || !birthday ) throw new CustomError( 404, "one or more fields are empty" );
            if ( username.length > 20 ) throw new CustomError( 404, "username can be a maximum of 20 characters" );
            if ( username.length < 3 ) throw new CustomError( 400, "username field must be greater than 3" );
            if ( password.length < 6 ) throw new CustomError( 400, "Password must contain 6 characters or more" );
            if ( typeof username !== "string" || typeof email !== "string" || typeof birthday !== "string" ) throw new CustomError( 404, "fields needs to be a string" );
            if ( !email.includes( "@gmail.com" ) ) throw new CustomError( 400, "unsupported email" );

            const passwordRegex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if ( !passwordRegex.test( password ) ) throw new CustomError( 400, 'The password must contain an uppercase character and a number' );

            const passwordAsHash = await this.hashManager.createHash( password );

            const hasUsername = await this.userData.getUserByUsername( username )
            if ( hasUsername ) throw new CustomError( 400, "username already registered" );

            const hasEmail = await this.userData.getUserByEmail( email )
            if ( hasEmail ) throw new CustomError( 400, "email already registered" );

            const id: string = this.idGenerator.generateId()
            await this.userData.signup( new UserModel( id, username.toLowerCase(), email, passwordAsHash, birthday ) );

            const token: string = this.authenticator.generateToken( { id: id } )
            return token;

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

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const user = await this.userData.getPublicUserById( tokenData.id );
            if ( !user ) throw new CustomError( 404, "user not found" );

            return user;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }

    updateUsername = async ( username: string, token: string ) => {

        try {

            if ( !username || !token ) throw new CustomError( 401, "one or more values are empty" );
            if ( !username ) throw new CustomError( 404, "new username not informed" );

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const user = await this.userData.getPrivateUserById( tokenData.id );
            if ( !user ) throw new CustomError( 404, "user not found" );

            const checkUsername = await this.userData.getUserByUsername( username );

            if ( user.username === username ) throw new CustomError( 404, "new username entered is the same as the current username" );
            if ( checkUsername ) throw new CustomError( 409, "username already in use" );

            if ( username.length > 20 ) throw new CustomError( 404, "username can be a maximum of 20 characters" );
            if ( username.length < 3 ) throw new CustomError( 400, "username field must be greater than 3" );
            if ( typeof username !== "string" ) throw new CustomError( 404, "fields needs to be a string" );

            await this.userData.updateUsername( username, tokenData.id );

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }
    }

    updateProfileImage = async ( avatar: FILE, token: string ) => {

        try {

            if ( !avatar ) throw new CustomError( 401, "file field is empty" );

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const user = await this.userData.getPrivateUserById( tokenData.id );
            if ( !user ) throw new CustomError( 404, "user not found" );
            const url = await this.storage.createImageURL( avatar, `avatars/${tokenData.id}` )
            await this.userData.updateProfileImage( url, tokenData.id )

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


    sendValidateAccount = async ( token: string ) => {

        try {

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const user = await this.userData.getPrivateUserById( tokenData.id );
            if ( !user ) throw new CustomError( 404, "user not found" );

            const code = await this.email.generateCode();
            await this.email.sendValidate( user.email, code );

            return code

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }


}
