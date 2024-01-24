const express = require('express');
const bodyParser = require('body-parser');
const gravatar = require('gravatar');
const fetch = require('node-fetch');
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cors());
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/getAvatar', async (req, res) => {
  const input = req.body.input.trim();
  let type, image;

  if (isValidEmail(input)) {
    type = 'email';
    image = gravatar.url(input, { s: '200', r: 'pg', d: 'identicon' }, true);
  } else if (isValidDomain(input)) {
    type = 'website';
    const domain = getDomainFromInput(input);
    try {
      const logoUrl = await getClearbitLogoUrl(domain);
      image = logoUrl;
    } catch (error) {
      console.error('Clearbit API Error:', error.message);
      if (req.headers['content-type'] === 'application/json') {
        res.status(500).json({ error: 'Error retrieving website logo.' });
        return;
      } else {
        res.render('error', { message: 'Error retrieving website logo.' });
        return;
      }
    }
  } else {
    if (req.headers['content-type'] === 'application/json') {
      res.status(400).json({ error: 'Invalid input. Please provide a valid email or website domain.' });
      return;
    } else {
      res.render('error', { message: 'Invalid input. Please enter a valid email or website domain.' });
      return;
    }
  }

  if (req.headers['content-type'] === 'application/json') {
    res.json({ type, image });
  } else {
    res.render('result', { type, input, image });
  }
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidDomain(domain) {
  const domainRegex = /^[^\s@]+\.[^\s@]+$/;
  return domainRegex.test(domain);
}

function getDomainFromInput(input) {
  const parts = input.split('@');
  return parts.length > 1 ? parts[1] : input;
}

async function getClearbitLogoUrl(domain) {
  const clearbitApiUrl = `https://logo.clearbit.com/${domain}`;
  try {
    const response = await fetch(clearbitApiUrl);
    if (response.ok) {
      return clearbitApiUrl;  // Return the URL directly, assuming the URL is the logo.
    } else {
      const data = await response.json();
      throw new Error(data.error.message);
    }
  } catch (error) {
    throw new Error('Error retrieving website logo.');
  }
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
