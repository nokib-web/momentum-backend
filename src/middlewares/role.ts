import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';

/**
 * Restrict access to specific roles
 * Must be used after protect middleware
 * @param roles - Array of allowed roles
 */
export const restrictTo = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        // Check if user exists on request (should be set by protect middleware)
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
            return;
        }

        // Check if user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.',
            });
            return;
        }

        next();
    };
};
