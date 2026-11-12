
import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Box, TextField, Button, Typography } from '@mui/material';

const isResumeUrl = (value) => {
  const candidate = value.includes('://') ? value : `https://${value}`;

  try {
    const url = new URL(candidate);

    return (
      ['http:', 'https:'].includes(url.protocol) &&
      Boolean(url.hostname) &&
      (url.hostname === 'localhost' || url.hostname.includes('.'))
    );
  } catch {
    return false;
  }
};

const ApplicationForm = ({ job, onBack }) => {
  const [formData, setFormData] = useState({
    job: job._id,
    candidateName: '',
    candidateEmail: '',
    resumeUrl: '',
    coverLetter: ''
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage(null);

    const resumeUrl = formData.resumeUrl.trim();

    if (!resumeUrl) {
      setError('Resume URL is required.');
      return;
    }

    if (!isResumeUrl(resumeUrl)) {
      setError('Please provide a valid URL for your resume.');
      return;
    }

    const payload = {
      job: formData.job,
      candidateName: formData.candidateName.trim(),
      candidateEmail: formData.candidateEmail.trim(),
      resumeUrl,
      coverLetter: formData.coverLetter.trim()
    };

    try {
      await axios.post(
        config.backendUrl + '/api/applications',
        payload
      );

      setSuccessMessage('Application submitted successfully!');

      setFormData({
        job: job._id,
        candidateName: '',
        candidateEmail: '',
        resumeUrl: '',
        coverLetter: ''
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to submit application. Please try again.'
      );

      console.error('Application submission error:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Apply for {job.title}
      </Typography>

      {successMessage && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {successMessage}
        </Typography>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Name"
          name="candidateName"
          value={formData.candidateName}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          name="candidateEmail"
          type="email"
          value={formData.candidateEmail}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Resume URL"
          name="resumeUrl"
          type="url"
          value={formData.resumeUrl}
          onChange={handleChange}
          required
          margin="normal"
          placeholder="https://example.com/my-resume.pdf"
        />

        <TextField
          fullWidth
          label="Cover Letter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
        />

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Button type="submit" variant="contained">
            Submit Application
          </Button>

          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ApplicationForm;
