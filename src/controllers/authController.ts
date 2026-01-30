import { Response, NextFunction } from 'express';
import { AuthRequest, UserStatus } from '../types';
import { User, Invite } from '../models';
import { generateToken, generateInviteToken } from '../utils';

/**
 * Login controller
 * POST /api/auth/login
 */
export const login = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }

        // Check if user is active
        if (user.status !== UserStatus.ACTIVE) {
            res.status(403).json({
                success: false,
                message: 'Your account is inactive. Please contact administrator.',
            });
            return;
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }

        // Generate JWT token
        const token = generateToken(user._id.toString(), user.email, user.role);

        // Return success response
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Invite user controller (ADMIN only)
 * POST /api/auth/invite
 */
export const inviteUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
            return;
        }

        // Check if pending invite exists
        const existingInvite = await Invite.findOne({
            email,
            acceptedAt: null,
        });

        if (existingInvite && !existingInvite.isExpired()) {
            res.status(400).json({
                success: false,
                message: 'A pending invite already exists for this email',
            });
            return;
        }

        // Generate invite token
        const inviteToken = generateInviteToken();

        // Calculate expiration time
        const inviteExpiryHours = parseInt(
            process.env.INVITE_EXPIRY_HOURS || '48',
            10
        );
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + inviteExpiryHours);

        // Create invite
        const invite = await Invite.create({
            email,
            role,
            token: inviteToken,
            expiresAt,
        });

        // TODO: In production, send email with invite link
        // For now, just return the token
        res.status(201).json({
            success: true,
            message: 'Invite created successfully',
            inviteToken,
            expiresAt,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Register via invite controller
 * POST /api/auth/register-via-invite
 */
export const registerViaInvite = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, password, inviteToken } = req.body;

        // Find invite by token
        const invite = await Invite.findOne({ token: inviteToken });

        if (!invite) {
            res.status(404).json({
                success: false,
                message: 'Invalid invite token',
            });
            return;
        }

        // Check if invite is expired
        if (invite.isExpired()) {
            res.status(400).json({
                success: false,
                message: 'Invite has expired',
            });
            return;
        }

        // Check if invite has already been accepted
        if (invite.acceptedAt) {
            res.status(400).json({
                success: false,
                message: 'Invite has already been used',
            });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: invite.email });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
            return;
        }

        // Create new user
        const user = await User.create({
            name,
            email: invite.email,
            password,
            role: invite.role,
            invitedAt: new Date(),
            status: UserStatus.ACTIVE,
        });

        // Update invite as accepted
        invite.acceptedAt = new Date();
        await invite.save();

        // Generate JWT token
        const token = generateToken(user._id.toString(), user.email, user.role);

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};
