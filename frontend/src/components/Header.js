
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const Header = ({
  companyName = 'CareerConnect',
  onPostJobClick,
  admin,
  onLogoutClick,
  onApplicationsClick,
  onHomeClick,
  onFindJobsClick,
  onCategoriesClick
}) => {
  return (
    <AppBar position="sticky" elevation={0} className="main-header">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="header-toolbar">

          <Box className="brand-section">
            <Box className="brand-logo">CC</Box>
            <Box>
              <Typography className="brand-name">
                {companyName}
              </Typography>
              <Typography className="brand-tagline">
                Find opportunities. Build your future.
              </Typography>
            </Box>
          </Box>

          <Box className="desktop-navigation">
            <Button
              onClick={onHomeClick}
              className="nav-link"
            >
              Home
            </Button>

            <Button
              onClick={onFindJobsClick}
              className="nav-link"
            >
              Find Jobs
            </Button>

            <Button
              onClick={onCategoriesClick}
              className="nav-link"
            >
              Categories
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {admin && (
              <>
                <Typography
                  variant="body2"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  Admin: {admin.email}
                </Typography>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onApplicationsClick}
                >
                  Applications
                </Button>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onLogoutClick}
                >
                  Logout
                </Button>
              </>
            )}

            <Button
              variant="contained"
              onClick={onPostJobClick}
              className="employer-button"
            >
              Post a Job
            </Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

Header.propTypes = {
  companyName: PropTypes.string,
  onPostJobClick: PropTypes.func.isRequired,
  admin: PropTypes.shape({
    email: PropTypes.string.isRequired,
    role: PropTypes.string
  }),
  onLogoutClick: PropTypes.func,
  onApplicationsClick: PropTypes.func,
  onHomeClick: PropTypes.func.isRequired,
  onFindJobsClick: PropTypes.func.isRequired,
  onCategoriesClick: PropTypes.func.isRequired
};

export default Header;
