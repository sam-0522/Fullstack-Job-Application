
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import config from '../config';

const AdminApplications = ({ token, onBack }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${config.backendUrl}/api/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const applicationData = response?.data?.data;

      setApplications(
        Array.isArray(applicationData) ? applicationData : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load applications. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async (applicationId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this application? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setDeletingId(applicationId);
      setError('');

      await axios.delete(
        `${config.backendUrl}/api/applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setApplications((previous) =>
        previous.filter((application) => application._id !== applicationId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to delete this application. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box className="inner-page" sx={{ py: 5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4
        }}
      >
        <Box>
          <Typography variant="overline" color="primary" fontWeight="bold">
            ADMIN PANEL
          </Typography>

          <Typography variant="h4" fontWeight="bold">
            Applications Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Review and manage candidate applications.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchApplications}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button variant="contained" onClick={onBack}>
            Back to Jobs
          </Button>
        </Stack>
      </Box>

      <Card sx={{ mb: 4, maxWidth: 280 }}>
        <CardContent>
          <Typography color="text.secondary" variant="body2">
            Total Applications
          </Typography>

          <Typography variant="h3" fontWeight="bold" color="primary">
            {applications.length}
          </Typography>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Alert severity="info">
          No applications have been submitted yet.
        </Alert>
      ) : (
        <Stack spacing={3}>
          {applications.map((application) => (
            <Card key={application._id} variant="outlined">
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 2
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {application.candidateName}
                    </Typography>

                    <Typography color="text.secondary">
                      {application.candidateEmail}
                    </Typography>
                  </Box>

                  <Chip
                    label="Application Received"
                    color="success"
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  Applied for
                </Typography>

                <Typography fontWeight="bold" sx={{ mb: 2 }}>
                  {application.job?.title || 'Job details unavailable'}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Department: {application.job?.department || 'Not specified'}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Location: {application.job?.location || 'Not specified'}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Applied on:{' '}
                  {application.appliedAt
                    ? new Date(application.appliedAt).toLocaleString()
                    : 'Date unavailable'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                  Resume
                </Typography>

                {application.resumeUrl ? (
                  <Link
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                  >
                    <DescriptionOutlinedIcon
                      fontSize="small"
                      sx={{ verticalAlign: 'middle', mr: 0.5 }}
                    />
                    View Candidate Resume
                  </Link>
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    No resume provided.
                  </Typography>
                )}

                <Typography fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                  Cover Letter
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-wrap' }}
                >
                  {application.coverLetter || 'No cover letter provided.'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleDelete(application._id)}
                    disabled={deletingId === application._id}
                  >
                    {deletingId === application._id
                      ? 'Deleting...'
                      : 'Delete Application'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

AdminApplications.propTypes = {
  token: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired
};

export default AdminApplications;
