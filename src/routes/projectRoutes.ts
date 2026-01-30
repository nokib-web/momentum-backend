import { Router } from 'express';
import {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
} from '../controllers/projectController';
import { protect, restrictTo } from '../middlewares';
import {
    validateProjectName,
    validateProjectDescription,
    validateRequest,
} from '../middlewares';
import { UserRole } from '../types';

const router = Router();

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private (All authenticated users)
 */
router.post(
    '/',
    protect,
    [validateProjectName(), validateProjectDescription(), validateRequest],
    createProject
);

/**
 * @route   GET /api/projects
 * @desc    Get all projects with pagination and filters
 * @access  Private (All authenticated users)
 */
router.get('/', protect, getAllProjects);

/**
 * @route   PATCH /api/projects/:id
 * @desc    Update a project (Admin only)
 * @access  Private/Admin
 */
router.patch('/:id', protect, restrictTo(UserRole.ADMIN), updateProject);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Soft delete a project (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), deleteProject);

export default router;
