import mongoose, { Schema } from 'mongoose';
import { IInvite, UserRole } from '../types';

const inviteSchema = new Schema<IInvite>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: [true, 'Role is required'],
    },
    token: {
        type: String,
        required: [true, 'Token is required'],
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiration date is required'],
    },
    acceptedAt: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create index on token field for faster lookups
inviteSchema.index({ token: 1 });

// Method to check if invite is expired
inviteSchema.methods.isExpired = function (): boolean {
    return new Date() > this.expiresAt;
};

// Create and export Invite model
const Invite = mongoose.model<IInvite>('Invite', inviteSchema);

export default Invite;
