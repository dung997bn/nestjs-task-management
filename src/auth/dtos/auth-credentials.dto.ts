import { ApiProperty } from "@nestjs/swagger"
import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty()
    username: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @ApiProperty()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' }
    )
    password: string
}