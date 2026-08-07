import * as argon2 from "argon2";

const binaryPepper = Buffer.from(process.env.PEPPER!);

export function hash(password: string): Promise<string> {
    return argon2.hash(password, { secret: binaryPepper });
}

export function compare(
    plainTextPassword: string,
    hash: string
): Promise<boolean> {
    return argon2.verify(hash, plainTextPassword, { secret: binaryPepper });
}
