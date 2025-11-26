// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('public')); // Serve index.html

mongoose.connect('mongodb://127.0.0.1:27017/funghi')
  .then(() => console.log(' Connesso a MongoDB'))
  .catch(err => console.error(' Errore di connessione:', err));

// Schema e modello e crea in automatico il db se non esiste
const User = mongoose.model('User', new mongoose.Schema({ nome: String, eta: Number }));

// Crea un nuovo utente
app.post('/api/utenti', async (req, res) => {
  try {
    const nuovoUtente = new User(req.body);
    await nuovoUtente.save();
    res.status(201).json(nuovoUtente);
  } catch (err) {
    res.status(400).json({ errore: err.message });
  }
});

//Ottieni tutti gli utenti
app.get('/api/utenti', async (req, res) => {
  const utenti = await User.find();
  res.json(utenti);
});

// Elimina un utente per ID
app.delete('/api/utenti/:id', async (req, res) => {
  try {
    const eliminato = await User.findByIdAndDelete(req.params.id);
    if (!eliminato) return res.status(404).json({ errore: 'Utente non trovato' });
    res.json({ messaggio: 'Utente eliminato', id: eliminato._id });
  } catch (err) {
    res.status(400).json({ errore: err.message });
  }
});

app.listen(3000, () => console.log(' Server su http://localhost:3000'));
