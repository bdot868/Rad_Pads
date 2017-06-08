const
  express = require('express'),
  app = express(),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  usersRoutes = require('./routes/users.js'),
  cors = require('cors'),
  request = require('request'),
  Zillow = require('node-zillow'),
  parser = require('xml2json'),
  mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/RadPads',
  port = process.env.PORT || 3001

// connect to mongodb:
mongoose.connect(mongoUrl, (err) => {
  console.log(err || 'Connected to MongoDB.🤘🏽')
})


//Log all incoming requests to the console:
app.use(logger('dev'))

// allow incoming ajax requests from other domains (including other localhost ports)
app.use(cors())

//interpret bodies of data that are included in requests:
app.use(bodyParser.json()) //interpret json bodies
app.use(bodyParser.urlencoded({extended: false})) //interpret form data

//server root route:
app.get('/', (req, res) => {
  res.json({message: "Server root. All API routes start with a Rad api..."})
})

app.post('/api/location', (req,res) => {
  console.log(req.body);
  var address = req.body.address
  var citystatezip = req.body.citystatezip
  zillow = new Zillow('X1-ZWz1fued5ovh8r_3l8b3')
  var url = `http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=${zillow.id}&address=${address}&citystatezip=${citystatezip}`

  request(url, function (error, response, body) {
    if(!error && response.statusCode == 200) {
      var jsonResponse = JSON.parse(parser.toJson(body))
       console.log(jsonResponse['SearchResults:searchresults'].response.results.result)

      // var zpid = jsonResponse['SearchResults:searchresults'].response.results.result[1].zpid
      // var updatedUrl = `http://www.zillow.com/webservice/GetUpdatedPropertyDetails.htm?zws-id=${zillow.id}&zpid=${zpid}`
      //
      // request(updatedUrl, function (error, response, details) {
      //   if(!error && response.statusCode == 200) {
      //     console.log(details)
      //   }
      // })
      res.json(jsonResponse)
    }
  })
})

// app.get('/api/location', (req,res) => {
//   res.json({message: "api info coming!"})
// })

app.use('/api/users', usersRoutes)

app.listen(port, (err) => {
  console.log(err || `Server running on ${port}`)
})
