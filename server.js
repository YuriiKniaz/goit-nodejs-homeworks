const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
  .then((con) => {
    console.log('Database connection successful')
   app.listen(3000)
  })
  .catch((error) => {
  console.log(error)
  process.exit(1)
})


// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })
