
import { useState, useEffect } from 'react';
import axios from 'axios';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import Header from './components/Header';
import Footer from './components/Footer';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import ApplicationForm from './components/ApplicationForm';
import AdminLogin from './components/AdminLogin';
import AdminApplications from './components/AdminApplications';
import config from './config';

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);

  // Stores the homepage section to scroll to after navigation.
  const [navigationTarget, setNavigationTarget] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  // Scroll after the homepage has rendered.
  useEffect(() => {
    if (view !== 'list' || !navigationTarget) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(navigationTarget)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      setNavigationTarget('');
    });

    return () => window.cancelAnimationFrame(frame);
  }, [view, navigationTarget]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        config.backendUrl + '/api/jobs'
      );

      const jobData = res?.data?.data;
      setJobs(Array.isArray(jobData) ? jobData : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // Navigate to a homepage section from any screen.
  const handleNavigation = (sectionId) => {
    setView('list');
    setNavigationTarget(sectionId);
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setView('jobDetail');
    window.scrollTo(0, 0);
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setView('apply');
    window.scrollTo(0, 0);
  };

  const handlePostJobClick = () => {
    if (token) {
      setView('postJob');
    } else {
      setView('adminLogin');
    }

    window.scrollTo(0, 0);
  };

  const handleAdminLoginSuccess = (receivedToken, adminDetails) => {
    setToken(receivedToken);
    setAdmin(adminDetails);
    setView('postJob');
    window.scrollTo(0, 0);
  };

  const handleAdminLogout = () => {
    setToken(null);
    setAdmin(null);
    setView('list');
    window.scrollTo(0, 0);
  };

  const handleJobPosted = (newJob) => {
    setJobs((previousJobs) => [newJob, ...previousJobs]);
    setView('list');
    setSearchTerm('');
    window.scrollTo(0, 0);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    handleNavigation('jobs');
  };

  const handleBackToJobs = () => {
    setView('list');
    setNavigationTarget('');
    window.scrollTo(0, 0);
  };

  const handleApplicationsClick = () => {
    setView('applications');
    window.scrollTo(0, 0);
  };

  // Get distinct departments from the available jobs.
  const categories = [
    ...new Set(
      jobs
        .map((job) => job.department)
        .filter(Boolean)
    )
  ];

  const handleCategoryClick = (category) => {
    setSearchTerm(category);
    handleNavigation('jobs');
  };

  return (
    <>
      <Header
        companyName={config.companyName}
        onPostJobClick={handlePostJobClick}
        admin={admin}
        onLogoutClick={handleAdminLogout}
        onApplicationsClick={handleApplicationsClick}
        onHomeClick={() => handleNavigation('home')}
        onFindJobsClick={() => handleNavigation('jobs')}
        onCategoriesClick={() => handleNavigation('categories')}
      />

      {/* Admin Login Page */}
      {view === 'adminLogin' && (
        <Container maxWidth="md" className="inner-page">
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onCancel={handleBackToJobs}
          />
        </Container>
      )}

      {/* Homepage and Job Listings */}
      {view === 'list' && (
        <>
          {/* Hero Section */}
          <Box className="hero-section" id="home">
            <Container maxWidth="lg">
              <Box className="hero-content">

                <Box className="hero-label">
                  <TrendingUpIcon fontSize="small" />
                  <span>Your next opportunity starts here</span>
                </Box>

                <Typography
                  component="h1"
                  className="hero-title"
                >
                  Find a job that
                  <br />
                  <span>moves you forward.</span>
                </Typography>

                <Typography className="hero-description">
                  Discover opportunities, explore new careers,
                  and connect with possibilities that match
                  your ambitions.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSearch}
                  className="hero-search"
                >
                  <TextField
                    fullWidth
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Job title, skill or department"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SearchIcon />}
                  >
                    Search Jobs
                  </Button>
                </Box>

                <Box className="hero-highlights">
                  <Box className="hero-highlight">
                    <WorkOutlineIcon />
                    <Typography>
                      <strong>{jobs.length}</strong> opportunities listed
                    </Typography>
                  </Box>

                  <Typography className="hero-highlight-note">
                    New opportunities added as employers post jobs
                  </Typography>
                </Box>

              </Box>
            </Container>
          </Box>

          {/* Categories Section */}
          <Container maxWidth="lg">
            <Box
              id="categories"
              sx={{
                py: 5,
                scrollMarginTop: '100px'
              }}
            >
              <Typography className="section-eyebrow">
                EXPLORE BY CATEGORY
              </Typography>

              <Typography
                variant="h4"
                component="h2"
                className="section-title"
                sx={{ mb: 2 }}
              >
                Find opportunities by department
              </Typography>

              <Typography
                className="section-description"
                sx={{ mb: 3 }}
              >
                Explore jobs based on the departments available.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Button
                      key={category}
                      variant="outlined"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </Button>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No job categories are available yet.
                  </Typography>
                )}

                <Button
                  variant="contained"
                  onClick={() => {
                    setSearchTerm('');
                    handleNavigation('jobs');
                  }}
                >
                  View All Jobs
                </Button>
              </Box>
            </Box>

            {/* Job Listings Section */}
            <Box
              id="jobs"
              className="jobs-section"
              sx={{ scrollMarginTop: '100px' }}
            >
              <Box className="jobs-heading">
                <Box>
                  <Typography className="section-eyebrow">
                    CAREER OPPORTUNITIES
                  </Typography>

                  <Typography
                    variant="h4"
                    component="h2"
                    className="section-title"
                  >
                    Explore open positions
                  </Typography>

                  <Typography className="section-description">
                    Find the right role and take the next step
                    in your career.
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  onClick={handlePostJobClick}
                  className="secondary-post-button"
                >
                  Post a Job
                </Button>
              </Box>

              <JobList
                jobs={jobs}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onJobSelect={handleJobSelect}
                onApplyClick={handleApplyClick}
              />
            </Box>
          </Container>
        </>
      )}

      {/* Job Details Page */}
      {view === 'jobDetail' && selectedJob && (
        <Container maxWidth="md" className="inner-page">
          <Button onClick={handleBackToJobs}>
            ← Back to jobs
          </Button>

          <Box className="detail-card">
            <Typography variant="h4" gutterBottom>
              {selectedJob.title}
            </Typography>

            <Typography color="text.secondary" gutterBottom>
              {selectedJob.location} · {selectedJob.type}
            </Typography>

            <Typography color="text.secondary" gutterBottom>
              {selectedJob.department}
            </Typography>

            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Job Description
            </Typography>

            <Typography sx={{ lineHeight: 1.9 }}>
              {selectedJob.description}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 4 }}
              onClick={() => handleApplyClick(selectedJob)}
            >
              Apply for this job
            </Button>
          </Box>
        </Container>
      )}

      {/* Public Application Page */}
      {view === 'apply' && selectedJob && (
        <Container maxWidth="md" className="inner-page">
          <ApplicationForm
            job={selectedJob}
            onBack={handleBackToJobs}
          />
        </Container>
      )}

      {/* Admin-Only Job Posting Page */}
      {view === 'postJob' && token && (
        <Container maxWidth="md" className="inner-page">
          <JobForm
            token={token}
            onJobPosted={handleJobPosted}
            onCancel={handleBackToJobs}
          />
        </Container>
      )}

      {/* Admin Applications Dashboard */}
      {view === 'applications' && token && (
        <Container maxWidth="lg" className="inner-page">
          <AdminApplications
            token={token}
            onBack={handleBackToJobs}
          />
        </Container>
      )}

      <Footer companyName={config.companyName} />
    </>
  );
}

export default App;
