const fs = require('fs');
const path = require('path');

const txtPatch = path.join(__dirname, 'text.txt');

const read  = fs.createReadStream(txtPatch);

read.on('data', function (chunk) {
   console.log(chunk.toString());
});