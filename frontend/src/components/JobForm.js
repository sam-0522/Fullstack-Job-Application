
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from '../config';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';

const JobForm = ({ onJobPosted, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    department: ''
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      department: formData.department.trim()
    };

    const type = formData.type.trim();

    if (type) {
      payload.type = type;
    }

    try {
      const res = await axios.post(
        config.backendUrl + '/api/jobs',
        payload
      );

      const savedJob = res?.data?.data;

      if (!savedJob || typeof savedJob !== 'object') {
        setError('Failed to post job. Please try again.');
        return;
      }

      onJobPosted(savedJob);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to post job. Please try again.'
      );
      console.error('Error posting job:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Post a New Job
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          margin="normal"
          multiline
          rows={4}
        />

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          margin="normal"
        >
          {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          margin="normal"
        />

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Button type="submit" variant="contained">
            Post Job
          </Button>

          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

JobForm.propTypes = {
  onJobPosted: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default JobForm;
