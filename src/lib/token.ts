import {v4 as uuidv4} from 'uuid';
import { createVerificationToken, getVerificationTokenByEmail, deleteVerificationToken } from '@/data/token';

export const generateToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date().getTime() + 60 * 60 * 1000; // 1 hour expiration

    //check if token alreaday exists
    const existingToken = await getVerificationTokenByEmail(email);

    // If the token already exists, delete it and create a new one
    if (existingToken) {
        await deleteVerificationToken(existingToken.identifier, existingToken.token);
        await createVerificationToken(email, token, expires);
    }
    // If the token does not exist, create a new one
    else {
        await createVerificationToken(email, token, expires);
    }
    return token;
}