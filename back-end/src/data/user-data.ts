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
                    birthday: user.getBirthday(),
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


    getPublicUserById = async ( token: string ) => {

        try {
            const user: PUBLIC_USER | null = await PRISMA_CLIENT.user.findUnique( {
                where: { id: token },
                select: { id: true, birthday: true, created_at: true, email: true, role: true, status: true, username: true, avatar: true }
            } )

            return user;

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

    getPrivateUserById = async ( token: string ) => {

        try {
            const user: PUBLIC_USER | null = await PRISMA_CLIENT.user.findUnique( {
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

}