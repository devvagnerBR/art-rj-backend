import { USER_DATA } from '../data/user-data';
import { CustomError } from '../models/custom-error';
import { USER_DTO } from '../types/user-dto';
import { Authenticator } from '../services/authenticator';
import { HashManager } from '../services/hash-manager';
import { USER_MODEL } from '../models/user-model';
import { IdGenerator } from '../services/id-generator';


export class USER_BUSINESS {


    constructor(

        private USER_DATA: USER_DATA,
        private authenticator: Authenticator,
        private hashManager: HashManager,
        private idGenerator: IdGenerator

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

            const hasUsername = await this.USER_DATA.checkUsername( username )
            if ( hasUsername ) throw new CustomError( 400, "username already registered" );

            const hasEmail = await this.USER_DATA.checkEmail( email )
            if ( hasEmail ) throw new CustomError( 400, "email already registered" );

            const id: string = this.idGenerator.generateId()
            await this.USER_DATA.signup( new USER_MODEL( id, username.toLowerCase(), email, passwordAsHash, birthday ) );

            const token: string = this.authenticator.generateToken( { id: id } )
            return token;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }



}