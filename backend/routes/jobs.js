
const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Job = require('../models/Job');
const protect = require('../middleware/auth');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

// PUBLIC: Get all jobs
router.get('/', async (req, res, next) => {
  try {
    const { type, department, limit = 50, page = 1 } = req.query;

    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);

    const query = {};
    if (type) query.type = type;
    if (department) query.department = department;

    const skip = (safePage - 1) * safeLimit;

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .skip(skip);

    const total = await Job.countDocuments(query);

    res.json({
      status: 'success',
      results: jobs.length,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
});

// PUBLIC: Get one job
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid job ID')],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          status: 'error',
          message: 'Job not found',
        });
      }

      res.json({ status: 'success', data: job });
    } catch (error) {
      next(error);
    }
  }
);

// ADMIN ONLY: Create a job
router.post(
  '/',
  protect,
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
    body('location').optional().trim(),
    body('type')
      .optional()
      .trim()
      .isIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
      .withMessage('Invalid job type'),
    body('department').optional().trim(),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { title, description, location, type, department } = req.body;

      const newJob = new Job({
        title,
        description,
        location,
        type,
        department,
      });

      const savedJob = await newJob.save();

      res.status(201).json({
        status: 'success',
        message: 'Job created successfully',
        data: savedJob,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ADMIN ONLY: Update a job
router.put(
  '/:id',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid job ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
    body('location').optional().trim(),
    body('type')
      .optional()
      .trim()
      .isIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
      .withMessage('Invalid job type'),
    body('department').optional().trim(),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const allowedFields = [
        'title',
        'description',
        'location',
        'type',
        'department',
      ];

      const updates = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      const updatedJob = await Job.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      );

      if (!updatedJob) {
        return res.status(404).json({
          status: 'error',
          message: 'Job not found',
        });
      }

      res.json({
        status: 'success',
        message: 'Job updated successfully',
        data: updatedJob,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ADMIN ONLY: Delete a job
router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid job ID')],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const deletedJob = await Job.findByIdAndDelete(req.params.id);

      if (!deletedJob) {
        return res.status(404).json({
          status: 'error',
          message: 'Job not found',
        });
      }

      res.json({
        status: 'success',
        message: 'Job deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
