const path = require('path');
const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const port = process.env.PORT || 3000;

app.engine('.hbs', hbs());
app.set('view engine', '.hbs');

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

function requireLogin(req, res, next) {
  const loggedIn = false;

  if (!loggedIn) {
    res.status(401).render('login-required', { layout: false });
  }

  next();
}

// Middleware for all requests starting with /user
app.use('/user', requireLogin);

app.get(['/', '/home'], (req, res) => {
  res.render('hello', { layout: false });
});

app.get('/about', (req, res) => {
  res.render('about', { layout: false });
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { layout: false, name: req.params.name });
});

// Catch-all 404: send local 404 page with image
app.use((req, res) => {
  res.status(404).render('404', { layout: false });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
