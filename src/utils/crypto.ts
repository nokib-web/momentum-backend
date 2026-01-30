import crypto from 'crypto';

/**
 * Generate a secure random token for invitations
 * @returns Hex string token (64 characters)
 */
export const generateInviteToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};
