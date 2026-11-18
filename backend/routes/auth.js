
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Please check your login details.',
        errors: errors.array(),
      });
    }

    try {
      const { email, password } = req.body;

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
      const jwtSecret = process.env.JWT_SECRET;

      if (!adminEmail || !adminPasswordHash || !jwtSecret) {
        return res.status(500).json({
          status: 'error',
          message: 'Admin authentication is not configured.',
        });
      }

      const emailMatches =
        email.toLowerCase() === adminEmail.toLowerCase();

      const passwordMatches = await bcrypt.compare(
        password,
        adminPasswordHash
      );

      if (!emailMatches || !passwordMatches) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password.',
        });
      }

      const token = jwt.sign(
        {
          email: adminEmail,
          role: 'admin',
        },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        status: 'success',
        message: 'Admin login successful.',
        token,
        admin: {
          email: adminEmail,
          role: 'admin',
        },
      });
    } catch (error) {
      console.error('Admin login error:', error.message);

      res.status(500).json({
        status: 'error',
        message: 'Unable to process login.',
      });
    }
  }
);

module.exports = router;
