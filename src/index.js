const express = require('express')
const route = require('./route/route')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())

mongoose.connect('mongodb+srv://jay420:gRLzeLdOa6ENyasF@cluster0.dnkg3q6.mongodb.net/group42Dtabase',
 {useNewUrlParser : true})


.then(() => console.log('MongoDb is Connected'))
.catch((err) => console.log(err))

app.use(route)

app.listen(process.env.PORT || 3000, function()
   {console.log("Express App is running on PORT" + (process.env.PORT || 3000))} )
