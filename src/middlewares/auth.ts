import { Response, NextFunction } from 'express';
import { AuthRequest, UserStatus } from '../types';
import { verifyToken } from '../utils/jwt';
import { User } from '../models';

/**
 * Protect middleware - Authenticates user via JWT token
 * Attaches user information to req.user
 */
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // 1. Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'No token provided. Please authenticate.',
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided. Please authenticate.',
            });
            return;
        }

        // 2. Verify token
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.',
            });
            return;
        }

        // 3. Find user by ID
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found. Token is invalid.',
            });
            return;
        }

        // 4. Check if user is active
        if (user.status === UserStatus.INACTIVE) {
            res.status(403).json({
                success: false,
                message: 'Your account is inactive. Please contact administrator.',
            });
            return;
        }

        // 5. Attach user to request
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication failed. Please try again.',
        });
    }
};
