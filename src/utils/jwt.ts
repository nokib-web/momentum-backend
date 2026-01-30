import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

/**
 * Generate JWT token for a user
 * @param userId - User ID to encode in token
 * @param email - User email
 * @param role - User role
 * @returns JWT token string
 */
export const generateToken = (userId: string, email: string, role: string): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRE || '7d';

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const payload: JWTPayload = {
        id: userId,
        email,
        role: role as any,
    };

    return jwt.sign(payload, secret, {
        expiresIn: expiresIn,
    } as jwt.SignOptions);
};

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded JWT payload
 */
export const verifyToken = (token: string): JWTPayload => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
        const decoded = jwt.verify(token, secret) as JWTPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
