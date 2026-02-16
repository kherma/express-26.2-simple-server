const path = require('path');
const express = require('express');
const hbs = require('express-handlebars');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

app.engine(
  'hbs',
  hbs({ extname: 'hbs', layoutsDir: './layouts', defaultLayout: 'main' }),
);

app.set('view engine', '.hbs');

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: false }));

// multer setup: store uploaded files in memory (no disk storage)
const storage = multer.memoryStorage();
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage, fileFilter });

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
  const { sent, file, error } = req.query;
  res.render('contact', { isSent: !!sent, isError: !!error, fileName: file });
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

app.post(
  '/contact/send-message',
  upload.single('projectDesign'),
  (req, res) => {
    const { author, sender, title, message } = req.body;
    const file = req.file; // multer places file here when uploaded

    // validate all fields including file
    if (author && sender && title && message && file) {
      return res.redirect(
        `/contact?sent=1&file=${encodeURIComponent(file.originalname)}`,
      );
    }

    // If validation fails, redirect back with error flag (PRG)
    return res.redirect('/contact?error=1');
  },
);

// Catch-all 404: send local 404 page with image
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
