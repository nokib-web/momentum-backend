import { Router } from 'express';
import { login, inviteUser, registerViaInvite } from '../controllers/authController';
import { protect, restrictTo } from '../middlewares';
import {
    validateEmail,
    validatePassword,
    validateName,
    validateRole,
    validateToken,
    validateRequest,
} from '../middlewares';
import { UserRole } from '../types';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    [validateEmail(), validatePassword(), validateRequest],
    login
);

/**
 * @route   POST /api/auth/invite
 * @desc    Invite a new user (Admin only)
 * @access  Private/Admin
 */
router.post(
    '/invite',
    protect,
    restrictTo(UserRole.ADMIN),
    [validateEmail(), validateRole(), validateRequest],
    inviteUser
);

/**
 * @route   POST /api/auth/register-via-invite
 * @desc    Register a new user via invite token
 * @access  Public
 */
router.post(
    '/register-via-invite',
    [validateName(), validatePassword(), validateToken(), validateRequest],
    registerViaInvite
);

export default router;
