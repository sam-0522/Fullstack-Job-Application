
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
import Chip from '@mui/material/Chip';

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const JobList = ({
  jobs,
  searchTerm,
  onSearchTermChange,
  onJobSelect,
  onApplyClick
}) => {
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
        [
          job.title,
          job.location,
          job.department,
          job.description,
          job.type
        ].some((value) =>
          value?.toLowerCase().includes(search)
        );

      const matchesType =
        selectedType === 'All' || job.type === selectedType;

      return matchesSearch && matchesType;
    });

    return [...matchingJobs].sort((a, b) => {
      if (sortOrder === 'newest') {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      }

      if (sortOrder === 'oldest') {
        return (
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
        );
      }

      if (sortOrder === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }

      return 0;
    });
  }, [jobs, searchTerm, selectedType, sortOrder]);

  return (
    <Box className="job-list-container">

      <Box className="job-filters">
        <TextField
          fullWidth
          label="Search jobs"
          placeholder="Search by title, skill or location"
          value={searchTerm}
          onChange={(event) =>
            onSearchTermChange(event.target.value)
          }
        />

        <TextField
          fullWidth
          select
          label="Job type"
          value={selectedType}
          onChange={(event) =>
            setSelectedType(event.target.value)
          }
        >
          {jobTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type === 'All' ? 'All Job Types' : type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Sort by"
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value)
          }
        >
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
          <MenuItem value="title">Title (A-Z)</MenuItem>
        </TextField>
      </Box>

      <Typography className="job-count">
        Showing <strong>{filteredJobs.length}</strong> of{' '}
        <strong>{jobs.length}</strong> jobs
      </Typography>

      {filteredJobs.length === 0 ? (
        <Box className="empty-jobs">
          <BusinessCenterOutlinedIcon />
          <Typography variant="h6">
            No matching jobs found
          </Typography>
          <Typography color="text.secondary">
            Try another keyword or change your filters.
          </Typography>
          <Button
            onClick={() => {
              onSearchTermChange('');
              setSelectedType('All');
            }}
          >
            Clear filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <Card className="job-card">

                <CardContent className="job-card-content">
                  <Box className="job-card-top">
                    <Box className="company-placeholder">
                      {(job.title || 'J').charAt(0).toUpperCase()}
                    </Box>

                    <Chip
                      label={job.type || 'Job'}
                      size="small"
                      className="job-type-chip"
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    className="job-card-title"
                  >
                    {job.title}
                  </Typography>

                  <Typography className="job-company">
                    {job.department || 'Career Opportunity'}
                  </Typography>

                  <Box className="job-meta">
                    <LocationOnOutlinedIcon fontSize="small" />
                    <Typography variant="body2">
                      {job.location || 'Location not specified'}
                    </Typography>
                  </Box>

                  <Typography className="job-description">
                    {job.description}
                  </Typography>
                </CardContent>

                <CardActions className="job-card-actions">
                  <Button
                    onClick={() => onJobSelect(job)}
                    className="details-button"
                    endIcon={<ArrowForwardIcon />}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => onApplyClick(job)}
                    className="apply-button"
                  >
                    Apply Now
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
      createdAt: PropTypes.string
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchTermChange: PropTypes.func.isRequired,
  onJobSelect: PropTypes.func.isRequired,
  onApplyClick: PropTypes.func.isRequired
};

export default JobList;
