
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const JobList = ({ jobs, onJobSelect, onApplyClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  const jobTypes = useMemo(() => {
    const types = jobs.map((job) => job.type).filter(Boolean);
    return ['All', ...new Set(types)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const matchingJobs = jobs.filter((job) => {
      const matchesSearch =
        !search ||
        [job.title, job.location, job.department, job.description]
          .some((value) => value?.toLowerCase().includes(search));

      const matchesType =
        selectedType === 'All' || job.type === selectedType;

      return matchesSearch && matchesType;
    });

    return [...matchingJobs].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      if (sortOrder === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortOrder === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }

      return 0;
    });
  }, [jobs, searchTerm, selectedType, sortOrder]);

  if (!jobs || jobs.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 3, textAlign: 'center' }}>
        No jobs available at the moment.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Explore Job Opportunities
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search jobs"
            placeholder="Search by title, location or department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Filter by Job Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {jobTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type === 'All' ? 'All Job Types' : type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Sort Jobs"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="title">Title (A-Z)</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredJobs.length} of {jobs.length} jobs
      </Typography>

      {filteredJobs.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 3, textAlign: 'center' }}>
          No matching jobs found. Try another search or filter.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {job.location}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {job.type}
                  </Typography>

                  {job.department && (
                    <Typography variant="body2" color="text.secondary">
                      {job.department}
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <Button size="small" onClick={() => onJobSelect(job)}>
                    View Details
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onApplyClick(job)}
                  >
                    Apply
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

JobList.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      location: PropTypes.string,
      type: PropTypes.string,
      department: PropTypes.string,
      description: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ).isRequired,
  onJobSelect: PropTypes.func.isRequired,
  onApplyClick: PropTypes.func.isRequired,
};

export default JobList;
