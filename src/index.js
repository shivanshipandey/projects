const mongoose = require('mongoose')
const express = require('express')
const route = require('./route/route')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(express.urlencoded({extended : true}))
mongoose.connect('mongodb+srv://Group-35:TXYaPnnpYDZooRvO@cluster1.mpw9wwe.mongodb.net/test',
{useNewUrlParser : true})

.then(() => console.log('MongoDb is connected'))
.catch(() => console.log(err))

app.use(route)

app.listen(process.env.PORT || 3000, function(){
    console.log("Express app is running on PORT" + (process.env.PORT || 3000) )
})
