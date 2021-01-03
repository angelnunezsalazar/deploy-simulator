'use strict';
const express = require('express');
var child_process = require('child_process');

function run_script(command, args, callback) {
  console.log("Starting Process.");
  var child = child_process.spawn(command,[args]);

  var scriptOutput = "";

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(data) {
      console.log(data);

      data=data.toString();
      scriptOutput+=data;
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function(data) {
      console.log('stderr: ' + data);

      data=data.toString();
      scriptOutput+=data;
  });

  child.on('close', function(code) {
      callback(scriptOutput,code);
  });
}

const app = express();
var appState="RUNNING"

app.get('/', (req, res) => {
  res.send(`App State: ${appState}`);
});

app.get('/deploy-portal', (req, res) => {
  if(appState=="DEPLOY IN PROGRESS"){
    res.send("DEPLOY IN PROGRESS (you can't deploy now). Check App State in '/'");
  }
  else{
    appState="DEPLOY IN PROGRESS";
    run_script("./deploy.sh", "katu-portal", function(output, exit_code) {
      appState="RUNNING";
      console.log('Script Finished.');
      console.log('Exit Code: ' + exit_code);
      console.log('Full output of script: ',output);
    });
    res.send("DEPLOYING NEW VERSION ... (it will take 3 minutes). Check App State in '/'");
  }
});

app.get('/deploy-backoffice', (req, res) => {
  if(appState=="DEPLOY IN PROGRESS"){
    res.send("DEPLOY IN PROGRESS (you can't deploy now). Check App State in '/'");
  }
  else{
    appState="DEPLOY IN PROGRESS";
    run_script("./deploy.sh","katu-backoffice", function(output, exit_code) {
      appState="RUNNING";
      console.log('Script Finished.');
      console.log('Exit Code: ' + exit_code);
      console.log('Full output of script: ',output);
    });
    res.send("DEPLOYING NEW VERSION ... (it will take 3 minutes). Check App State in '/'");
  }
});

const PORT = 9090;
const HOST = '0.0.0.0';
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);