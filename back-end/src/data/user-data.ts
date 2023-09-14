import { User } from "@prisma/client";
import { UserModel } from "../models/user-model";
import { PRISMA_CLIENT } from "./prisma";
import { PUBLIC_USER } from "../types/public-user";


export class UserData {


    signup = async ( user: UserModel ) => {

        try {
            await PRISMA_CLIENT.user.create( {
                data: {
                    id: user.getId(),
                    username: user.getUsername(),
                    email: user.getEmail(),
                    password: user.getPassword()
                }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }


    getUserByUsername = async ( username: string ) => {

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

    getUserByCPF = async ( cpf: string ) => {

        try {
            const result: User | null = await PRISMA_CLIENT.user.findUnique( {
                where: { cpf }
            } )

            return result;

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }


    getUserByPhoneNumber = async ( phoneNumber: string ) => {

        try {
            const result: User | null = await PRISMA_CLIENT.user.findUnique( {
                where: { phone_number: phoneNumber }
            } )

            return result;

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }


    getPublicUserById = async ( token: string ) => {

        try {
            const user: PUBLIC_USER | null = await PRISMA_CLIENT.user.findFirst( {
                where: { id: token },
                 select: { id: true, birthday: true, created_at: true, email: true, role: true, status: true, username: true, avatar: true, cpf: true, phone_number: true }
            } )

            return user;

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

    getPrivateUserById = async ( token: string ) => {

        try {
            const user: User | null = await PRISMA_CLIENT.user.findUnique( {
                where: { id: token }
            } )

            return user;

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

    updateUsername = async ( update: string, token: string ) => {

        try {

            await PRISMA_CLIENT.user.update( {
                where: { id: token },
                data: { username: update }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }


    updateProfileImage = async ( url: string, token: string ) => {

        try {

            await PRISMA_CLIENT.user.update( {
                where: { id: token },
                data: { avatar: url }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

    validateAccount = async ( token: string ) => {

        try {

            await PRISMA_CLIENT.user.update( {
                where: { id: token },
                data: { status: true }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }


    }

    changePassword = async ( newPassword: string, token: string, ) => {

        try {

            await PRISMA_CLIENT.user.update( {
                where: { id: token },
                data: { password: newPassword }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

    updateUser = async ( token: string, phone_number?: string, cpf?: string, birthday?: string ) => {


        try {

            await PRISMA_CLIENT.user.update( {
                where: { id: token },
                data: {
                    cpf: cpf || undefined,
                    phone_number: phone_number || undefined,
                    birthday: birthday || undefined
                }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

}
