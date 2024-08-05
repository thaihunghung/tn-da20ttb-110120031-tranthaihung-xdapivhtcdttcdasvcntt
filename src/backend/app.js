const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
const passport = require('./authentication/passport');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
app.use(express.static("public"));
const swaggerUi = require('swagger-ui-express');
const indexRouter = require('./routes/IndexRouter');
const session = require('express-session');
const authRoutes = require('./routes/AuthRoutes');
const { getAnalytics } = require("firebase/analytics");

//config passport 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());

app.use(express.static("public"));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

morgan('combined')
app.use('/', indexRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = 1509;
app.listen(port, () => {
  console.log(`App listening http://localhost:${port}`)
})