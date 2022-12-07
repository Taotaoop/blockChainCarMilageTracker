'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');

let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

//use this identity to query
const appAdmin = config.appAdmin;

//get all assets in world state
app.get('/queryAll', async (req, res) => {
  console.log("LMHERE")
  let networkObj = await network.connectToNetwork(appAdmin);
  console.log("IM done")
  let response = await network.invoke(networkObj, true, 'queryAll', '');
  let parsedResponse = await JSON.parse(response);
  console.log("IN APPPPPPP>JS");
  console.log(parsedResponse);

  res.send(parsedResponse);

});


app.post('/registerUser', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);
  res.send("send back")

  // let voterId = req.body.voterId;
  let verify_code = req.body.code;
  // //first create the identity for the voter and add to wallet
  let response = await network.registerUser(req.body.role, req.body.username, req.body.password, verify_code);
  console.log('response from registerVoter: ');
  console.log(response);
  // if (response.error) {
  //   res.send(response.error);
  // } else {
  //   console.log('req.body.voterId');
  //   console.log(req.body.voterId);
  //   let networkObj = await network.connectToNetwork(voterId);
  //   console.log('networkobj: ');
  //   console.log(networkObj);

  //   if (networkObj.error) {
  //     res.send(networkObj.error);
  //   }
  //   console.log('network obj');
  //   console.log(util.inspect(networkObj));


  //   req.body = JSON.stringify(req.body);
  //   let args = [req.body];
  //   //connect to network and update the state with voterId  

  //   let invokeResponse = await network.invoke(networkObj, false, 'createVoter', args);
    
  //   if (invokeResponse.error) {
  //     res.send(invokeResponse.error);
  //   } else {

  //     console.log('after network.invoke ');
  //     let parsedResponse = JSON.parse(invokeResponse);
  //     parsedResponse += '. Use voterId to login above.';
  //     res.send(parsedResponse);

  //   }

  // }


});
app.post('/addCar', async(req,res) =>{
  let networkObj = await network.connectToNetwork(appAdmin);
  console.log('util inspecting');
  console.log(util.inspect(networkObj));
  req.body = JSON.stringify(req.body);
  console.log('req.body');
  console.log(req.body);
  let args = [req.body];

  let response = await network.invoke(networkObj, false, 'addACar', args);
  if (response.error) {
    res.send(response.error);
  } else {
    console.log('response: ');
    console.log(response);
    // let parsedResponse = await JSON.parse(response);
    res.send(response);
  }
});

app.post('/queryByVim', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);

  let networkObj = await network.connectToNetwork(appAdmin);
  console.log('after network OBj');
  let response = await network.invoke(networkObj, true, 'query', req.body.vim);
  console.log(response);
  response = JSON.parse(response);
  if (response.error) {
    console.log('inside eRRRRR');
    res.send(response.error);
  } else {
    console.log('inside ELSE');
    res.send(response);
  }
});


app.listen(process.env.PORT || 8081);