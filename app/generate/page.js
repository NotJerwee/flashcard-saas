'use client'
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { Container, Box, Typography, Paper, TextField, Button, Grid, Card, CardActionArea, CardContent, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog } from "@mui/material";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async () => {
        fetch('/api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
        .catch((error) => {
            console.error("Error fetching flashcards:", error);
        });
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert("Please enter a name for your flashcard set.");
            return;
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcard || []
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection name already exist.")
                return
            } else {
            collections.push({name})
            batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }   
        } else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }
        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })
        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    if(!isLoaded){
        return <div>Generating . . . </div>
    }

    if (!isSignedIn) {
        return (
        <div className="container mx-auto px-6">
            <div className="mt-10 mb-14 flex flex-col items-center">
            <h1 className="text-4xl font-semibold mb-8">Hold Up!</h1>
            <div className="w-full bg-gray-100 shadow-lg rounded-xl p-8 flex flex-col items-center">
                <p className="text-blue-600">
                Please log in or create an account to access the flashcard generator.
                </p>
            </div>
            </div>
        </div>
        );
    }

    return (
        <Container maxWidth="md">
            <Box 
            sx={{
                mt: 4, 
                mb: 6, 
                display: "flex", 
                flexDirection: 'column', 
                alignItems: 'center',
            }}>
                <Typography variant="h4">Create Your Flashcards!</Typography>
                <Paper sx={{ p: 4, width: '100%' }}>
                    <TextField 
                        value={text}
                        onChange={(e) => setText(e.target.value)} 
                        label="Enter text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                    />
                    <Button
                    variant='contained' 
                    color='primary'
                    onClick={handleSubmit} 
                    fullWidth> 
                    Generate</Button>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Your study set:</Typography>
                    <Grid container spacing={4}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box sx={{
                                                perspective: '1000px', 
                                                '& > div': {
                                                    transition: 'transform 0.4s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                },
                                                '& > div > div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box'
                                                },
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                }
                                            }}>
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
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained' color='secondary' onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle> 
                <DialogContent>
                    <DialogContentText>
                        Enter a name for your new collection.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        label='Collection Name' 
                        type='text' 
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={saveFlashcards} disabled={isSaving}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}