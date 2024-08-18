'use client'

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import getStripe from './utils/get-stripe';
import { ClerkProvider } from '@clerk/nextjs';

const FlashcardSaaS = () => {

  	const handleSubmit = async () => {
		try {
		const checkoutSession = await fetch('/api/checkout_sessions', {
			method: 'POST',
			headers: { origin: 'http://localhost:3000' },
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
		<AppBar position="static">
			<Toolbar>
			<Typography variant="h6" style={{ flexGrow: 1 }}>
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
			<Typography variant="h2" component="h1" gutterBottom>
			Welcome to Flashcard SaaS
			</Typography>
			<Typography variant="h5" component="h2" gutterBottom>
			The easiest way to create flashcards from your text.
			</Typography>
			<Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
			Get Started
			</Button>
		</Box>

		<Box sx={{ my: 6, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={3} display="flex" justifyContent="center">
              <Paper elevation={3} sx={{ padding: 11, width: 300, height: 300, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Simple to use</Typography>
                <Typography>Quick and easy flashcard creation.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} display="flex" justifyContent="center">
              <Paper elevation={3} sx={{ padding: 11, width: 300, height: 300, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Organized</Typography>
                <Typography>Organize flashcards into decks.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} display="flex" justifyContent="center">
              <Paper elevation={3} sx={{ padding: 11, width: 300, height: 300, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>Collaboration</Typography>
                <Typography>Share decks with others.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

		<Box sx={{ my: 6, textAlign: 'center' }}>
			<Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
				Pricing
			</Typography>
			<Grid container spacing={4} justifyContent="center" alignItems="center">
				<Grid item xs={12} md={4} display="flex" justifyContent="center">
				<Paper elevation={3} sx={{ padding: 5, width: 400, height: 300, textAlign: 'center' }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
					Free Plan
					</Typography>
					<Typography sx={{ mb: 2 }}>$0/month</Typography>
					<Typography sx={{ mb: 2 }}>Basic flashcard creation</Typography>
					<Typography sx={{ mb: 2 }}>Up to 3 decks</Typography>
					<Button variant="contained" color="primary" onClick={() => handleSubmit('free-plan')}>
					Select Free Plan
					</Button>
				</Paper>
				</Grid>
				<Grid item xs={12} md={4} display="flex" justifyContent="center">
				<Paper elevation={3} sx={{ padding: 5, width: 400, height: 300, textAlign: 'center' }}>
					<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
					Premium Plan
					</Typography>
					<Typography sx={{ mb: 2 }}>$10/month</Typography>
					<Typography sx={{ mb: 2 }}>Unlimited flashcard creation</Typography>
					<Typography sx={{ mb: 2 }}>Unlimited decks</Typography>
					<Typography sx={{ mb: 2 }}>Access to premium features</Typography>
					<Button variant="contained" color="primary" onClick={() => handleSubmit('premium-plan')}>
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
