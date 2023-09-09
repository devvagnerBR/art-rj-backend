import { User } from "@prisma/client";
import { UserModel } from "../models/user-model";
import { PRISMA_CLIENT } from "./prisma";

export class UserData {

    signup = async ( user: UserModel ) => {
        try {

            await PRISMA_CLIENT.user.create( {
                data: {
                    id: user.getId(),
                    username: user.getUsername(),
                    email: user.getEmail(),
                    birthday: user.getBirthday(),
                    password: user.getPassword()
                }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }

    checkEmail = async ( email: string ) => {

        try {

            const user: User | null = await PRISMA_CLIENT.user.findFirst( {
                where: { email }
            } )

            return user

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

    checkUsername = async ( username: string ) => {

        try {
            const user = await PRISMA_CLIENT.user.findFirst( {
                where: { username }
            } )

            return user

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }

    getUserByEmail = async ( email: string ) => {

        try {

            const result: User | null = await PRISMA_CLIENT.user.findUnique( {
                where: { email }
            } )

            return result;

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }


}