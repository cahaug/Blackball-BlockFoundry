const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();



const server = express();

server.use(helmet());

var allowedOrigins = [
                      'https://api.blackball.co',
                    //   'http://localhost:4242' FE testing via localhost
                     ];

// server.use(cors({
//   origin: function(origin, callback){
//     // allow requests with no origin 
//     // (like mobile apps or curl requests) -> why would we want that, the front end will only ever be talking to the backend
//     if(!origin) {console.log('CR-NoOrigin',origin, origin.length); return callback(null, true)};
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     console.log('CR-W-Origin',origin, origin.length);
//     return callback(null, true);
//   }
// }));
server.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) {return callback(null, true)};
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));
server.use(express.json({ limit: "2mb" }));
var hpp = require('hpp');
server.use(hpp());

server.get('/', (req, res) => {
    res.status(200).json({message:"Backend is Up"})
})

// catch 404 and forward to the error handler
server.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler 
server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ 
        message: {},
        error: err
        // change this back before final deployment!!! -UNchanged-
        // error: req.server.get('env') === 'development' ? 
        // err : {}
        
    });
});

module.exports = server;