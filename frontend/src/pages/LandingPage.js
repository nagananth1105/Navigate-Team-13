import React from 'react';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

const LandingPage = () => {
  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 8,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Navigate
              </Typography>
              <Typography variant="h5" gutterBottom>
                AI-Powered Assessment & Adaptive Learning Platform
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Revolutionize education with personalized learning paths, 
                intelligent assessments, and data-driven insights.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button 
                  component={RouterLink} 
                  to="/register" 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    mr: 2, 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/login" 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Log In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/assets/hero-image.svg"
                alt="Navigate Platform"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  display: 'block',
                  mx: 'auto'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
          A comprehensive suite of tools designed to enhance the educational experience
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 2 }}>
              <SchoolIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                AI-Powered Assessment
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Create, administer, and grade assessments with intelligent AI assistance. 
                Generate questions based on learning objectives and analyze performance patterns.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 2 }}>
              <AutoGraphIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Adaptive Learning Paths
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Personalized learning journeys adapt to each student's strengths and challenges.
                Provide targeted resources and recommendations based on performance data.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 2 }}>
              <AssessmentIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Expert Feedback Panel
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Receive comprehensive feedback from AI-simulated subject matter experts.
                Gain insights from multiple perspectives on assessments and projects.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to transform your educational experience?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Join Navigate today and discover a new approach to teaching and learning.
          </Typography>
          <Button 
            component={RouterLink} 
            to="/register" 
            variant="contained" 
            size="large" 
            color="primary"
          >
            Create an Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'primary.dark', 
          color: 'white', 
          py: 4, 
          mt: 'auto' 
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Navigate
              </Typography>
              <Typography variant="body2">
                AI-Powered Assessment & Adaptive Learning Platform
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2" component="div">
                <Box component="ul" sx={{ listStyle: 'none', pl: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button component={RouterLink} to="/login" sx={{ color: 'white', p: 0 }}>
                      Log In
                    </Button>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Button component={RouterLink} to="/register" sx={{ color: 'white', p: 0 }}>
                      Register
                    </Button>
                  </Box>
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">
                support@navigate-learning.com
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Navigate. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;