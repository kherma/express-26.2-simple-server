const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

// Middleware to provide `res.show(name)` for serving files from /views
app.use((req, res, next) => {
  res.show = (name) => {
    return res.sendFile(path.join(__dirname, 'views', name));
  };
  next();
});

function requireLogin(req, res, next) {
  const loggedIn = false;

  if (!loggedIn) {
    return res.status(401).show('login-required.html');
  }

  next();
}

// Middleware for all requests starting with /user
app.use('/user', requireLogin);

app.get(['/', '/home'], (req, res) => {
  return res.show('hello.html');
});

app.get('/about', (req, res) => {
  return res.show('about.html');
});

app.get('/hello/:name', (req, res) => {
  return res.send(`Hello ${req.params.name}`);
});

// Catch-all 404: send local 404 page with image
app.use((req, res) => {
  res.status(404);
  return res.show('404.html');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
