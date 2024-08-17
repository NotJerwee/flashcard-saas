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
		<ClerkProvider>
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
			<Button variant="outlined" color="primary" sx={{ mt: 2 }}>
			Learn More
			</Button>
		</Box>

	  	<Box sx={{ my: 6, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>Feature 1</Typography>
                <Typography>Quick and easy flashcard creation.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>Feature 2</Typography>
                <Typography>Organize flashcards into decks.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>Feature 3</Typography>
                <Typography>Share decks with others.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

		<Box sx={{ my: 6, textAlign: 'center' }}>
			<Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
			<Grid container spacing={4} justifyContent="center">
				<Grid item xs={12} md={4}>
				<Paper elevation={3} sx={{ padding: 2 }}>
					<Typography variant="h6" gutterBottom>Free Plan</Typography>
					<Typography>$0/month</Typography>
					<Typography>Basic flashcard creation</Typography>
					<Typography>Up to 3 decks</Typography>
					<Button variant="contained" color="primary" onClick={() => handleSubmit('free-plan')}>
					Select Free Plan
					</Button>
				</Paper>
				</Grid>
				<Grid item xs={12} md={4}>
				<Paper elevation={3} sx={{ padding: 2 }}>
					<Typography variant="h6" gutterBottom>Premium Plan</Typography>
					<Typography>$10/month</Typography>
					<Typography>Unlimited flashcard creation</Typography>
					<Typography>Unlimited decks</Typography>
					<Typography>Access to premium features</Typography>
					<Button variant="contained" color="primary" onClick={() => handleSubmit('premium-plan')}>
					Select Premium Plan
					</Button>
				</Paper>
				</Grid>
			</Grid>
		</Box>

	</div>
	</ClerkProvider>
  );
  
};

export default FlashcardSaaS;
