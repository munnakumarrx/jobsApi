require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose')
const app = express();

const authRouter = require('./routes/user')
const jobsRouter = require('./routes/jobs')
const authenticatedMiddleware = require('./middleware/authentication')

// error handler
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');


app.use(express.json());
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticatedMiddleware,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start().catch(err=>{
  console.log(err.message)
});
