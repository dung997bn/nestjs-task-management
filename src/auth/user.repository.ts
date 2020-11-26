import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dtos/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        try {
            const { username, password } = authCredentialsDto

            const salt = await bcrypt.genSalt()
            const user = new User()
            user.username = username
            user.salt = salt
            user.password = await this.hashPassword(password, user.salt)
            await user.save()
        } catch (error) {
            if (error.code === "23505") {
                throw new BadRequestException("Username already exists.")
            }
            throw new InternalServerErrorException(error)
        }
    } 

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto
        const user = await this.findOne({ username })

        if (user && await user.validatePassword(password)) {
            return user.username
        } else {
            return null
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)
    }
}