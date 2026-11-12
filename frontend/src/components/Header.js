
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Header = ({ companyName = 'CareerConnect' }) => {
  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        backgroundColor: '#1565c0',
        color: '#ffffff',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, sm: 76 },
          px: { xs: 2, sm: 4 },
          gap: 1.5,
        }}
      >
        {/* Text-based brand logo */}
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            backgroundColor: '#ffffff',
            color: '#1565c0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          CC
        </Box>

        <Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              fontSize: { xs: '1.05rem', sm: '1.3rem' },
            }}
          >
            {companyName}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            Find opportunities. Build your future.
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
