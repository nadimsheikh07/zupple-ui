'use client';

import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Sign Up Error
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* You can add additional content here */}
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Please try again or contact support if the problem persists.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}