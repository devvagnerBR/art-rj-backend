import { IdGenerator } from '../services/id-generator';
import { Role } from '@prisma/client';




export class USER_MODEL {

    private role: Role
    
    constructor(
        
        private id: string,
        private username: string,
        private email: string,
        private password: string,
        private birthday: string,


    ) {
        this.role = Role.USER
    }

    getId(): string { return this.id }
    getUsername(): string { return this.username }
    getEmail(): string { return this.email }
    getPassword(): string { return this.password }
    getBirthday(): string { return this.birthday }
    getRole(): Role { return this.role }


}
