import nodemailer from 'nodemailer';
import { CustomError } from '../models/custom-error';




export class Email {


    generateCode = async () => {

        const itens = process.env.NODEMAILER_HASH as string;
        let code = '';
        const codeLength = 6;

        for ( let i = 0; i < codeLength; i++ ) {
            const randomIndex = Math.floor( Math.random() * itens.length );
            code += itens.charAt( randomIndex );
        }

        return code;

    }

    sendValidate = async ( userEmail: string, code: string ) => {

        try {

            const mailTransporter = nodemailer.createTransport( {
                service: "gmail",
                port: 487,
                secure: false,
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: process.env.NODEMAILER_PASSWORD
                }, tls: {
                    rejectUnauthorized: true
                }
            } )

            const smtpConfig = {
                from: process.env.NODEMAILER_EMAIL,
                to: userEmail,
                subject: "confirmação de conta",
                text: `código de confirmação ${code}`
            }

            const result = await mailTransporter.sendMail( smtpConfig, )
            return result


        } catch ( error: any ) {
            throw new CustomError( 409, error.message );
        }

    }


    validateCode = async ( code: string, confirmationCode: string ) => {


        try {
            
            if ( code !== confirmationCode ) throw new CustomError( 409, 'invalid confirmation code' );
            return true;

        } catch ( error: any ) {
            throw new CustomError( 409, error.message );
        }
    }


}