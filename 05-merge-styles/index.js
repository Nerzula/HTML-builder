const fs = require('fs/promises');
const path = require('path');

async function buildCssBundle() {
   const stylesFolder = path.join(__dirname, 'styles');
   const outputFolder = path.join(__dirname, 'project-dist');
   const bundleFile = path.join(outputFolder, 'bundle.css');

   try {
      if (await fileExists(bundleFile)) {
         await fs.unlink(bundleFile);
      }

      await fs.mkdir(outputFolder, { recursive: true });

      const writeStream = fs.open(bundleFile, 'w');

      await processFolder(stylesFolder, await writeStream);

      console.log('bundle.css has been created successfully');
   } catch (error) {
      console.error(`Error: ${error.message}`);
   }
}

async function processFolder(folderPath, writeStream) {
   const items = await fs.readdir(folderPath, { withFileTypes: true });

   for (const item of items) {
      const itemPath = path.join(folderPath, item.name);

      if (item.isFile() && path.extname(item.name) === '.css') {
         const cssContent = await fs.readFile(itemPath, 'utf-8');
         await (await writeStream).write(`${cssContent}\n`);
      } else if (item.isDirectory()) {
         await processFolder(itemPath, writeStream);
      }
   }
}

async function fileExists(filePath) {
   try {
      await fs.access(filePath);
      return true;
   } catch {
      return false;
   }
}

buildCssBundle();
