'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from 'your-auth-library'
import {
	Container,
	TextField,
	Button,
	Typography,
	Box,
	Grid,
	Card,
	CardActionArea,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions
} from '@mui/material'
import { db } from 'your-firebase-config'
import { doc, getDoc, setDoc, writeBatch, collection } from 'firebase/firestore'

export default function Generate() {
	const { isLoaded, isSignedIn, user } = useUser()
	const [text, setText] = useState('')
	const [flashcards, setFlashcards] = useState([])
	const [setName, setSetName] = useState('')
	const [dialogOpen, setDialogOpen] = useState(false)
	const router = useRouter()

	const searchParams = useSearchParams()
	const search = searchParams.get('id')

	const handleOpenDialog = () => setDialogOpen(true)
	const handleCloseDialog = () => setDialogOpen(false)

	useEffect(() => {
		async function getFlashcard() {
		 	if (!search || !user) return
		
			const colRef = collection(doc(collection(db, 'users'), user.id), search)
			const docs = await getDocs(colRef)
			const flashcards = []
			docs.forEach((doc) => {
				flashcards.push({ id: doc.id, ...doc.data() })
			})
			getFlashcards(flashcards)
		}
		getFlashcard()
	}, [search, user])

	const handleCardClick = (id) => {
		setFlipped((prev) => ({
			...prev,
			[id]: !prev[id],
		}))
	}

	const handleSubmit = async () => {
		if (!text.trim()) {
			alert('Please enter some text to generate flashcards.')
			return
		}

		try {
			const response = await fetch('/api/generate', {
				method: 'POST',
				body: text,
			})

			if (!response.ok) {
				throw new Error('Failed to generate flashcards')
			}

			const data = await response.json()
			setFlashcards(data)
		} catch (error) {
			console.error('Error generating flashcards:', error)
			alert('An error occurred while generating flashcards. Please try again.')
		}
	}

	const saveFlashcards = async () => {
		if (!setName.trim()) {
			alert('Please enter a name for your flashcard set.')
			return
		}

		try {
			const userDocRef = doc(collection(db, 'users'), user.id)
			const userDocSnap = await getDoc(userDocRef)

			const batch = writeBatch(db)

			if (userDocSnap.exists()) {
				const userData = userDocSnap.data()
				const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
				batch.update(userDocRef, { flashcardSets: updatedSets })
			} else {
				batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
			}

			const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
			batch.set(setDocRef, { flashcards })

			await batch.commit()

			alert('Flashcards saved successfully!')
			handleCloseDialog()
			setSetName('')
		} catch (error) {
			console.error('Error saving flashcards:', error)
			alert('An error occurred while saving flashcards. Please try again.')
		}
	}

	return (
		<Container maxWidth="md">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Generate Flashcards
				</Typography>
				<TextField
					value={text}
					onChange={(e) => setText(e.target.value)}
					label="Enter text"
					fullWidth
					multiline
					rows={4}
					variant="outlined"
					sx={{ mb: 2 }}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmit}
					fullWidth
				>
					Generate Flashcards
				</Button>
			</Box>

			{flashcards.length > 0 && (
				<Container maxWidth="md">
				<Grid container spacing={3} sx={{ mt: 4 }}>
				  {flashcards.map((flashcard) => (
					<Grid item xs={12} sm={6} md={4} key={flashcard.id}>
					  <Card>
						<CardActionArea onClick={() => handleCardClick(flashcard.id)}>
						  <CardContent>
							<Box sx={{ /* Styling for flip animation */ }}>
							  <div>
								<div>
									<Typography variant="h5" component="div">
										{flashcard.front}
								  	</Typography>
								</div>
								<div>
									<Typography variant="h5" component="div">
										{flashcard.back}
								  	</Typography>
								</div>
							  </div>
							</Box>
						  </CardContent>
						</CardActionArea>
					  </Card>
					</Grid>
				  ))}
				</Grid>
			  </Container>
			)}

			<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
				<Button variant="contained" color="primary" onClick={handleOpenDialog}>
					Save Flashcards
				</Button>
			</Box>

			<Dialog open={dialogOpen} onClose={handleCloseDialog}>
				<DialogTitle>Save Flashcard Set</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter a name for your flashcard set.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						label="Set Name"
						type="text"
						fullWidth
						value={setName}
						onChange={(e) => setSetName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button onClick={saveFlashcards} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	)
}