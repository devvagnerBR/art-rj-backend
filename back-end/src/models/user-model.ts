import { Role } from '@prisma/client';




export class UserModel {

    private role: Role
    
    constructor(
        
        private id: string,
        private username: string,
        private email: string,
        private password: string,


    ) {
        this.role = Role.USER
    }

    getId(): string { return this.id }
    getUsername(): string { return this.username }
    getEmail(): string { return this.email }
    getPassword(): string { return this.password }
    getRole(): Role { return this.role }


}
