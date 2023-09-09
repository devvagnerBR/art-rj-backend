import { User } from "@prisma/client"

export type PUBLIC_USER = Omit<User, 'password' > 