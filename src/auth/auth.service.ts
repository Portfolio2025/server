import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'user/user.service';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private readonly jwt: JwtService
    ) { }
    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByPayload({name: username});
        if (await argon2.verify(user.password, pass)) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.name };
        return {
            access_token: await this.jwt.signAsync(payload),
        };
    }
}
