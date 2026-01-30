import mongoose, { Schema } from 'mongoose';
import { IProject, ProjectStatus } from '../types';

const projectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Project description is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(ProjectStatus),
            default: ProjectStatus.ACTIVE,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Creator is required'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

// Create index on isDeleted field for efficient queries
projectSchema.index({ isDeleted: 1 });

// Additional useful indexes
projectSchema.index({ status: 1 });
projectSchema.index({ createdBy: 1 });

// Create and export Project model
const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
