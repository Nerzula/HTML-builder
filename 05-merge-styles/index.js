const fs = require('fs');
const path = require('path');

function buildCssBundle() {
   const stylesFolder = path.join(__dirname, 'styles');
   const outputFolder = path.join(__dirname, 'project-dist');
   const bundleFile = path.join(outputFolder, 'bundle.css');

   if (fs.existsSync(bundleFile)) {
      fs.unlinkSync(bundleFile);
   }

   if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
   }

   const writeStream = fs.createWriteStream(bundleFile);

   function processFolder(folderPath) {
      const items = fs.readdirSync(folderPath, { withFileTypes: true });

      for (const item of items) {
         const itemPath = path.join(folderPath, item.name);

         if (item.isFile() && path.extname(item.name) === '.css') {
            const cssContent = fs.readFileSync(itemPath, 'utf-8');
            writeStream.write(cssContent + '\n');
         } else if (item.isDirectory()) {
            processFolder(itemPath);
         }
      }
   }

   processFolder(stylesFolder);

   writeStream.end();
   console.log('bundle.css has been created successfully');
}

// Запуск функции
buildCssBundle();
