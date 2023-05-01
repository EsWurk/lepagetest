require('dotenv').config();  // Importation du module dotenv

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Configuration de l'analyseur de corps pour parser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Définition des routes
app.use('/style.css', express.static(__dirname + '/style.css', { type: 'text/css' }));
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
<html>
<head>
  <title>Mon formulaire de commande</title>
  <link rel="stylesheet" href="style.css">
  <script>
  const form = document.querySelector('.my-form');
  const confirmationMessage = document.querySelector('#confirmation-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch('/submit', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        confirmationMessage.textContent = 'Votre message a bien été envoyé.';
        confirmationMessage.style.display = 'block';
      })
      .catch(error => {
        confirmationMessage.textContent = 'Une erreur est survenue lors de l\'envoi du message.';
        confirmationMessage.style.display = 'block';
      });
  });
</script>
</head>
<body>
  <form class="my-form" method="POST" action="/submit">
    <label for="nom">Nom :</label>
    <input type="text" class="my-input" name="nom" required>
    <br>
    <label for="prenom">Prénom :</label>
    <input type="text" class="my-input" name="prenom" required>
    <br>
    <label for="commande">Commande :</label>
    <br>
    <input type="checkbox" class="my-checkbox" name="commande" value="Option 1"> Calles jaune<br>
    <input type="checkbox" class="my-checkbox" name="commande" value="Option 2"> Calle téflon<br>
    <input type="checkbox" class="my-checkbox" name="commande" value="Option 3"> Option 3<br>
    <input type="checkbox" class="my-checkbox" name="commande" value="Option 4"> Option 1<br>
    <input type="checkbox" class="my-checkbox" name="commande" value="Option 5"> Option 2<br>
    <input type="checkbox" class="my-checkbox" name="commande" value="Option 6"> Option 3<br>
    <input type="checkbox" class="my-checkbox" name="commande" value="Option 7"> Option 1<br>
    <input type="checkbox" class="my-checkbox" name="commande" value="Option 8"> Option 2<br>
    <input type="checkbox" class="my-checkbox" name="commande" value="Option 9"> Option 3<br>
    <label for:"Autres>Autres :</label>
    <br>
    <textarea id="autres" name="autres" class="my-autres" rows="3" cols="0"></textarea>
    <br>
    <button type="submit" class="my-button">Envoyer</button>
    <div id="confirmation-message" style="display: none;"></div>
  </form>
</body>
</html>

  `);
});

app.post('/submit', (req, res) => {
  const { nom, prenom, commande, autres } = req.body;
  const options = [].concat(commande);
  const date = new Date().toLocaleDateString();
  const subject = `Commande de ${nom} ${prenom}`;
  let body = `Options choisies : ${options.join(', ')}\nDate : ${date}`;
  if (autres && autres.trim() !== '') {
    body += `\nautres : ${autres}`;
  }
  

  // Configuration de l'envoi d'e-mail avec nodemailer
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'testlogiciellepage@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'testlogiciellepage@gmail.com',
    to: 'testlogiciellepage@gmail.com',
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send('Une erreur est survenue lors de l\'envoi du message.');
    } else {
      console.log('Message envoyé : %s', info.messageId);
      // Afficher le message de confirmation dans la page
      res.send('Votre message a bien été envoyé.');
    }
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
