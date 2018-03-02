
// set the static files location /public/img will be /img for users


const express = require('express');
const app = express();
const path = require('path');
var staticdir = process.env.NODE_ENV === 'production' ? 'dist.prod' : 'dist.dev'; 
app.use(express.static(__dirname + '/' + staticdir)); 

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/' + staticdir + '/index.html'));
});

// get static files dir




const hostname = '0.0.0.0';
const port = 3000;

const server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);  
});
