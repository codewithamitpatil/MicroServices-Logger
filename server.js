//cube ctl  cobbernate
require("dotenv").config();
const express = require('express');

// importing logger
const logger = require('./logger');


const port = 3000;


const app = express();


app.get('',async(req,res,next)=>{

   res.send("hello from amit");

});
app.get('/amit',async(req,res,next)=>{

   res.send("amit from amit");

});

const listen = ()=>{
  app.listen(port,()=>{
   logger.info({
     message:"server is running",
     Function:"amit",
     purpose: "To check if server is started on port or not",
   });
  });
}

listen();

module.exports = app;