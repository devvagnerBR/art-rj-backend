import * as bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export class HashManager {


    createHash = async ( value: string ): Promise<string> => {

        const cost = Number( process.env.BCRYPT_COST );
        const salt = await bcrypt.genSalt( cost );

        return bcrypt.hash( value, salt );

    };

    compareHash = ( value: string, hashedValue: string ): Promise<boolean> => {
        return bcrypt.compare( value, hashedValue );
    };
}