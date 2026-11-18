
const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Application = require('../models/Application');
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

// ADMIN ONLY: View all applications
router.get('/', protect, async (req, res, next) => {
  try {
    const { job, limit = 50, page = 1 } = req.query;

    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);

    const query = {};
    if (job) query.job = job;

    const skip = (safePage - 1) * safeLimit;

    const applications = await Application.find(query)
      .populate('job', 'title department location')
      .sort({ appliedAt: -1 })
      .limit(safeLimit)
      .skip(skip);

    const total = await Application.countDocuments(query);

    res.json({
      status: 'success',
      results: applications.length,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      data: applications,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN ONLY: View one application
router.get(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid application ID')],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const application = await Application.findById(req.params.id)
        .populate('job');

      if (!application) {
        return res.status(404).json({
          status: 'error',
          message: 'Application not found',
        });
      }

      res.json({ status: 'success', data: application });
    } catch (error) {
      next(error);
    }
  }
);

// PUBLIC: Submit a job application
router.post(
  '/',
  [
    body('job').isMongoId().withMessage('Valid job ID is required'),
    body('candidateName')
      .trim()
      .notEmpty()
      .withMessage('Candidate name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('candidateEmail')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('resumeUrl')
      .trim()
      .notEmpty()
      .withMessage('Resume URL is required')
      .isURL()
      .withMessage('Please provide a valid resume URL'),
    body('coverLetter')
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage('Cover letter must not exceed 5000 characters'),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const {
        job,
        candidateName,
        candidateEmail,
        resumeUrl,
        coverLetter,
      } = req.body;

      const jobExists = await Job.findById(job);

      if (!jobExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Job posting not found',
        });
      }

      const newApplication = new Application({
        job,
        candidateName,
        candidateEmail,
        resumeUrl,
        coverLetter,
      });

      const savedApplication = await newApplication.save();
      const populatedApplication = await savedApplication.populate(
        'job',
        'title department'
      );

      res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully',
        data: populatedApplication,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ADMIN ONLY: Delete an application
router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid application ID')],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const deletedApplication = await Application.findByIdAndDelete(
        req.params.id
      );

      if (!deletedApplication) {
        return res.status(404).json({
          status: 'error',
          message: 'Application not found',
        });
      }

      res.json({
        status: 'success',
        message: 'Application deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
