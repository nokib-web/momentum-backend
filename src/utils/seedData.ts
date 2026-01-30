import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Project from '../models/Project';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/momentum';
        await mongoose.connect(mongoUri);
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Project.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create Admin User
        const adminPassword = await bcrypt.hash('Admin123!', 10);
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@momentum.com',
            password: adminPassword,
            role: 'ADMIN',
            status: 'ACTIVE',
        });
        console.log('✅ Created admin user: admin@momentum.com / Admin123!');

        // Create Manager User
        const managerPassword = await bcrypt.hash('Manager123!', 10);
        const manager = await User.create({
            name: 'John Manager',
            email: 'manager@momentum.com',
            password: managerPassword,
            role: 'MANAGER',
            status: 'ACTIVE',
        });
        console.log('✅ Created manager user: manager@momentum.com / Manager123!');

        // Create Staff Users
        const staffPassword = await bcrypt.hash('Staff123!', 10);
        const staff1 = await User.create({
            name: 'Alice Staff',
            email: 'alice@momentum.com',
            password: staffPassword,
            role: 'STAFF',
            status: 'ACTIVE',
        });

        const staff2 = await User.create({
            name: 'Bob Staff',
            email: 'bob@momentum.com',
            password: staffPassword,
            role: 'STAFF',
            status: 'ACTIVE',
        });
        console.log('✅ Created staff users');

        // Create Sample Projects
        const projects = [
            {
                name: 'Website Redesign',
                description: 'Complete redesign of the company website with modern UI/UX principles and responsive design.',
                status: 'ACTIVE',
                createdBy: admin._id,
            },
            {
                name: 'Mobile App Development',
                description: 'Native mobile application for iOS and Android platforms with offline support.',
                status: 'ACTIVE',
                createdBy: manager._id,
            },
            {
                name: 'API Integration',
                description: 'Integration with third-party APIs for payment processing and analytics.',
                status: 'ACTIVE',
                createdBy: staff1._id,
            },
            {
                name: 'Database Migration',
                description: 'Migration from legacy database to modern cloud-based solution.',
                status: 'ARCHIVED',
                createdBy: admin._id,
            },
            {
                name: 'Security Audit',
                description: 'Comprehensive security audit and implementation of best practices.',
                status: 'ACTIVE',
                createdBy: manager._id,
            },
            {
                name: 'Documentation Update',
                description: 'Update all technical documentation and create user guides.',
                status: 'ARCHIVED',
                createdBy: staff2._id,
            },
            {
                name: 'Performance Optimization',
                description: 'Optimize application performance and reduce load times by 50%.',
                status: 'ACTIVE',
                createdBy: admin._id,
            },
            {
                name: 'CI/CD Pipeline',
                description: 'Set up automated testing and deployment pipeline with GitHub Actions.',
                status: 'ACTIVE',
                createdBy: manager._id,
            },
        ];

        await Project.insertMany(projects);
        console.log('✅ Created sample projects');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('   Admin:   admin@momentum.com / Admin123!');
        console.log('   Manager: manager@momentum.com / Manager123!');
        console.log('   Staff:   alice@momentum.com / Staff123!');
        console.log('   Staff:   bob@momentum.com / Staff123!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
