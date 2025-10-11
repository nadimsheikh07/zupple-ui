'use client';

import React, { Suspense } from 'react';
import {
  Container,
  Paper,
  Box,
} from '@mui/material';
import { ErrorComponent } from '@/components/errorComponent';

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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

            <ErrorComponent title='error' description='Please try again or contact support if the problem persists.
'/>
          </Paper>
        </Box>
      </Container>
    </Suspense>
  );
}