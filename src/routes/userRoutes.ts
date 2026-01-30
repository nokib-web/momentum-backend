import { Router } from 'express';
import { getAllUsers, updateUserRole, updateUserStatus } from '../controllers/userController';
import { protect, restrictTo } from '../middlewares';
import {
    validateRoleRequired,
    validateStatus,
    validateRequest,
} from '../middlewares';
import { UserRole } from '../types';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination (Admin only)
 * @access  Private/Admin
 */
router.get(
    '/',
    protect,
    restrictTo(UserRole.ADMIN),
    getAllUsers
);

/**
 * @route   PATCH /api/users/:id/role
 * @desc    Update user role (Admin only)
 * @access  Private/Admin
 */
router.patch(
    '/:id/role',
    protect,
    restrictTo(UserRole.ADMIN),
    [validateRoleRequired(), validateRequest],
    updateUserRole
);

/**
 * @route   PATCH /api/users/:id/status
 * @desc    Update user status (Admin only)
 * @access  Private/Admin
 */
router.patch(
    '/:id/status',
    protect,
    restrictTo(UserRole.ADMIN),
    [validateStatus(), validateRequest],
    updateUserStatus
);

export default router;
