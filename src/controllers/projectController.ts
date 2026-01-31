import { Response, NextFunction } from 'express';
import { AuthRequest, ProjectStatus } from '../types';
import { Project } from '../models';

/**
 * Create project controller (All authenticated users)
 * POST /api/projects
 */
export const createProject = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, description } = req.body;

        // Create project
        const project = await Project.create({
            name,
            description,
            createdBy: req.user?.id,
        });

        // Populate createdBy field
        await project.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            project,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all projects with pagination (All authenticated users)
 * GET /api/projects
 */
export const getAllProjects = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get pagination and filter params from query
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const search = req.query.search as string;
        const skip = (page - 1) * limit;

        // Build query
        const query: any = { isDeleted: false };

        // Apply status filter if provided
        if (status && Object.values(ProjectStatus).includes(status as ProjectStatus)) {
            query.status = status;
        }

        // Apply search filter if provided
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Find all projects with pagination
        const projects = await Project.find(query)
            .populate('createdBy', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Get total count
        const total = await Project.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            projects,
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
 * Update project controller (ADMIN only)
 * PATCH /api/projects/:id
 */
export const updateProject = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        // Build update object with only provided fields
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) {
            // Validate status
            if (!Object.values(ProjectStatus).includes(status)) {
                res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be one of: ${Object.values(ProjectStatus).join(', ')}`,
                });
                return;
            }
            updateData.status = status;
        }

        // Find and update project
        const project = await Project.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found or has been deleted',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            project,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete project controller - Soft delete (ADMIN only)
 * DELETE /api/projects/:id
 */
export const deleteProject = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        // Find and soft delete project
        const project = await Project.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                status: ProjectStatus.DELETED,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found or has already been deleted',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
