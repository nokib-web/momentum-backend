import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole, UserStatus } from '../types';
import { User } from '../models';

/**
 * Get all users with pagination (ADMIN only)
 * GET /api/users
 */
export const getAllUsers = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get pagination params from query
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        // Apply search filter if provided
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Find all users with pagination
        const users = await User.find(query)
            .select('name email role status createdAt')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Get total count
        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user role (ADMIN only)
 * PATCH /api/users/:id/role
 */
export const updateUserRole = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        if (!Object.values(UserRole).includes(role)) {
            res.status(400).json({
                success: false,
                message: `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}`,
            });
            return;
        }

        // Find and update user
        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select('name email role status createdAt');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user status (ADMIN only)
 * PATCH /api/users/:id/status
 */
export const updateUserStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!Object.values(UserStatus).includes(status)) {
            res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${Object.values(UserStatus).join(', ')}`,
            });
            return;
        }

        // Prevent admin from deactivating themselves
        if (req.user && req.user.id === id && status === UserStatus.INACTIVE) {
            res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account',
            });
            return;
        }

        // Find and update user
        const user = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).select('name email role status createdAt');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'User status updated successfully',
            user,
        });
    } catch (error) {
        next(error);
    }
};
