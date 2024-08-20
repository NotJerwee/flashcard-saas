'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import getStripe from './utils/get-stripe';

const FlashcardSaaS = () => {

  const handleSubmit = async (plan) => {
    try {
      const checkoutSession = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
        body: JSON.stringify({ plan })
      });
      const checkoutSessionJson = await checkoutSession.json();

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
    }
  };

  return (
    <div>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="secondary" sx={{ mt: 2, px: 4, py: 1 }} href="/generate">
          Get Started
        </Button>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={3}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Simple to use</Typography>
              <Typography>Quick and easy flashcard creation.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Organized</Typography>
              <Typography>Organize flashcards into decks.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>AI Generated</Typography>
              <Typography>Flashcards are powered by AI.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Pricing
        </Typography>
		<Grid container spacing={4} justifyContent="center" alignItems="center">
			<Grid item xs={12} md={2} display="flex" justifyContent="center">
				<Paper elevation={4} sx={{ padding: 3, borderRadius: 2, height: 350, width: 306 }}>
				<Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
					Free Plan
				</Typography>
				<Typography sx={{ mb: 2 }}>$0/month</Typography>
				<Typography sx={{ mb: 2 }}>Limited flashcard creation</Typography>
				<Typography sx={{ mb: 2 }}>Limited decks</Typography>
				<Button variant="contained" color="secondary" onClick={() => handleSubmit('free-plan')}>
					Select Free Plan
				</Button>
				</Paper>
			</Grid>
			<Grid item xs={12} md={2} display="flex" justifyContent="center">
				<Paper elevation={4} sx={{ padding: 3, borderRadius: 2, height: 350, width: 306 }}>
				<Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
					Premium Plan
				</Typography>
				<Typography sx={{ mb: 2 }}>$10/month</Typography>
				<Typography sx={{ mb: 2 }}>Unlimited flashcard creation</Typography>
				<Typography sx={{ mb: 2 }}>Unlimited decks</Typography>
				<Button variant="contained" color="secondary" onClick={() => handleSubmit('premium-plan')}>
					Select Premium Plan
				</Button>
				</Paper>
			</Grid>
		</Grid>
      </Box>

    </div>
  );

};

export default FlashcardSaaS;
