const express = require('express')
const route = require('./routes/route.js')
const app = express()
const mongoose = require('mongoose')
app.use(express.json())


mongoose.connect("mongodb+srv://vikramsingh7568:AlLbBhXCJYPKmwIK@cluster0.5swhv4u.mongodb.net/Mini-blog-project?retryWrites=true&w=majority", {
   useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});



















// const express = require('express');
// //var bodyParser = require('body-parser');

// const route = require('./router/router');

// const app = express();
// const { default: mongoose } = require('mongoose')

// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));

//  app.use(express.json())

// mongoose.connect("mongodb+srv://sonal-plutonium:5dJokPsnG43EGYHE@cluster0.koc4qx2.mongodb.net/sonal-DB?retryWrites=true&w=majority", {
//     useNewUrlParser: true
// })
//     .then(() => console.log("MongoDB is connected"))
//     .catch(err => console.log(err))

// app.use('/', route);

// app.listen(process.env.PORT || 3000, function () {
//     console.log('Express app running on port ' + (process.env.PORT || 3000))
// });



// const express = require('express');
// const bodyParser = require('body-parser');
// const route = require('./routes/route.js');
// const { default: mongoose } = require('mongoose');
// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// mongoose.connect("mongodb+srv://functionup-cohort:G0Loxqc9wFEGyEeJ@cluster0.rzotr.mongodb.net/Pritesh8769811-DB?retryWrites=true&w=majority", {
//     useNewUrlParser: true
// })
// .then( () => console.log("MongoDb is connected"))
// .catch ( err => console.log(err) )

// // app.use (
// //     function (req, res, next) {
// //         console.log ("inside GLOBAL MW");
// //         next();
// //   }
// //   );

// app.use('/', route);


// app.listen(process.env.PORT || 3000, function () {
//     console.log('Express app running on port ' + (process.env.PORT || 3000))
// });