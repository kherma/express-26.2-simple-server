const path = require('path');
const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const port = process.env.PORT || 3000;

app.engine(
  'hbs',
  hbs({ extname: 'hbs', layoutsDir: './layouts', defaultLayout: 'main' }),
);

app.set('view engine', '.hbs');

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

function requireLogin(req, res, next) {
  const loggedIn = false;

  if (!loggedIn) {
    res.status(401).render('login-required');
  }

  next();
}

// Middleware for all requests starting with /user
app.use('/user', requireLogin);

app.get(['/', '/home'], (req, res) => {
  res.render('hello');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});
app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { layout: false, name: req.params.name });
});

// Catch-all 404: send local 404 page with image
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
