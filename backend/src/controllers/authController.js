const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { formatSuccess, formatError, sanitizeUser } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json(formatError('User already exists', 400));
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        logger.info(`New user registered: ${email}`);

        res.status(201).json(formatSuccess({
            user: sanitizeUser(user),
            token
        }, 'User registered successfully'));

    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json(formatError('Invalid credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json(formatError('Invalid credentials', 401));
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json(formatError('Account is inactive', 401));
        }

        // Generate token
        const token = generateToken(user._id);

        logger.info(`User logged in: ${email}`);

        res.json(formatSuccess({
            user: sanitizeUser(user),
            token
        }, 'Login successful'));

    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('projects');
        res.json(formatSuccess(user));
    } catch (error) {
        logger.error(`Get user error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar) user.avatar = avatar;

        await user.save();

        logger.info(`User profile updated: ${user.email}`);

        res.json(formatSuccess(sanitizeUser(user), 'Profile updated successfully'));

    } catch (error) {
        logger.error(`Update profile error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

const syncUser = async (req, res) => {
    try {
        const { email, name, googleId, avatar } = req.body;

        if (!email) {
            return res.status(400).json(formatError('Email is required', 400));
        }

        let user = await User.findOne({ email });

        if (user) {
            // Update existing user
            if (googleId && !user.googleId) user.googleId = googleId;
            if (avatar && !user.avatar) user.avatar = avatar;
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                googleId,
                avatar,
                password: null // No password for Google Auth
            });
        }

        // Generate JWT for backend access
        const token = generateToken(user._id);

        res.json(formatSuccess({
            user: sanitizeUser(user),
            token
        }, 'User synced successfully'));

    } catch (error) {
        logger.error(`Sync user error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

const logout = async (req, res) => {
    try {
        logger.info(`User logged out: ${req.user.email}`);
        res.json(formatSuccess(null, 'Logged out successfully'));
    } catch (error) {
        logger.error(`Logout error: ${error.message}`);
        res.status(500).json(formatError(error.message));
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    logout,
    syncUser
};
