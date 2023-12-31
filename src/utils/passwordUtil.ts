import { Request } from 'express'
import bcrypt from 'bcryptjs'
import { vendorPayload, authPayload } from '../dto/index'
import jwt from 'jsonwebtoken'

const generateSalt = async () => {
    return await bcrypt.genSalt()
}

const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

const validatePassword = async (password: string, salt: string, hashedPassword: string) => {
    return await generatePassword(password, salt) === hashedPassword
}

const generateToken = (payload: authPayload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        {
            expiresIn: '1d'
        }
    )
}

const validateToken = async (req: Request) => {

    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return false
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as authPayload
        req.user = decoded
        return true

    } catch (error) {

        return false

    }
}

export {
    generatePassword,
    generateSalt,
    validatePassword,
    generateToken,
    validateToken
}