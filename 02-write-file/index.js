const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const { stdin: input, stdout: output } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const writeTxt = fs.createWriteStream(filePath, { flags: 'a' });
const rl = readline.createInterface({ input, output, terminal: true });

rl.on('SIGINT', () => {
   handle();
});

console.log('Welcome! Enter the text you want to write to the file. To exit, type "exit" or press Ctrl+C');

rl.on('line', (input) => {
   if (input.trim().toLowerCase() === 'exit') {
      handle();
   } else {
      writeTxt.write(`${input}\n`, 'utf8', (err) => {
         if (err) {
            console.error('Error writing to a file:', err.message);
         } else {
            console.log('The text has been recorded successfully! Enter the following text or "exit" to exit');
         }
      });
   }
});

function handle() {
   console.log('Thanks! Goodbye!');
   rl.close();
   writeTxt.end();
   process.exit(0);
}
