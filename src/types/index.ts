import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User Types
export enum UserRole {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    STAFF = 'STAFF',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    invitedAt?: Date;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Invite Types
export interface IInvite extends Document {
    _id: Types.ObjectId;
    email: string;
    role: UserRole;
    token: string;
    expiresAt: Date;
    acceptedAt?: Date | null;
    createdAt: Date;
    isExpired(): boolean;
}

// Project Types
export enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
    DELETED = 'DELETED',
}

export interface IProject extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    status: ProjectStatus;
    isDeleted: boolean;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Auth Request Type
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: UserRole;
    };
}

// JWT Payload Type
export interface JWTPayload {
    id: string;
    email: string;
    role: UserRole;
}
