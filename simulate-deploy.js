'use strict';
const express = require('express');
const fs = require("fs");



function updateMetaJson(){
  const jsonData = {
    buildDate: new Date().getTime(),
    localDate: new Date().toLocaleString()
  };

  const jsonContent = JSON.stringify(jsonData);

  fs.writeFile("./public/meta.json", jsonContent, "utf8", function (error) {
    if (error) {
      console.log("An error occured while saving build date and time to meta.json");
      return console.log(error);
    }

    console.log("Latest build date and time updated in meta.json file");
  })
}

const app = express();
app.get('/deploy', (req, res) => {
  updateMetaJson()
  res.send('Hello World');
});

const PORT = 9090;
const HOST = '0.0.0.0';
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);