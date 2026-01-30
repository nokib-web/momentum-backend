import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { UserRole } from '../types';

/**
 * Middleware to check validation results
 */
export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((err) => ({
                field: err.type === 'field' ? err.path : 'unknown',
                message: err.msg,
            })),
        });
        return;
    }

    next();
};

/**
 * Common validation chains
 */

// Email validation
export const validateEmail = (): ValidationChain =>
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail();

// Password validation
export const validatePassword = (): ValidationChain =>
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

// Name validation
export const validateName = (): ValidationChain =>
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters');

// Role validation
export const validateRole = (): ValidationChain =>
    body('role')
        .optional()
        .isIn(Object.values(UserRole))
        .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`);

// Project name validation
export const validateProjectName = (): ValidationChain =>
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Project name must be between 3 and 100 characters');

// Project description validation
export const validateProjectDescription = (): ValidationChain =>
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Project description must be between 10 and 500 characters');

// Token validation
export const validateToken = (): ValidationChain =>
    body('token')
        .trim()
        .notEmpty()
        .withMessage('Token is required')
        .isLength({ min: 32 })
        .withMessage('Invalid token format');

// MongoDB ObjectId validation
export const validateObjectId = (field: string): ValidationChain =>
    body(field)
        .trim()
        .notEmpty()
        .withMessage(`${field} is required`)
        .isMongoId()
        .withMessage(`Invalid ${field} format`);
