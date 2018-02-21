var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var where = require('node-where');
var tzlookup = require("tz-lookup");
var timezone = require('node-google-timezone');

var app = express();
var port = process.env.Port || 8000;


app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "Origin, x-access-token, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.get('/api/getCountryInfo/:location', function(req,res){
    let loc = req.params.location;
    let timestamp = 1402629305; 
    where.is(loc, function(err, result) {
        if (result) {
          let lat = result.attributes.lat;
          let lng = result.attributes.lng;
          timezone.data(lat, lng,timestamp,function (err, tz) {
            if(tz){
                res.json({
                    "status" : 200,
                    "timeZone" : tz.raw_response.timeZoneName
                });
            }
            else{
                res.json(err);
            }
        })
        }
        else{
            res.json(err);
        }
      });
})

app.listen(port, function() {
    console.log('Server is running on port : ' + port);
  });
  