const fs = require('fs');
const path = require('path');

function copyDir() {
   const src = path.join(__dirname, 'files');
   const build = path.join(__dirname, 'files-copy');

   if (fs.existsSync(build)) {
      removeFolderSync(build);
   }

   fs.mkdirSync(build, { recursive: true });

   copyContent(src, build);

   console.log('Copying completed!');
}

function copyContent(src, dest) {
   const items = fs.readdirSync(src, { withFileTypes: true });

   for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isFile()) {
         fs.copyFileSync(srcPath, destPath);
      } else if (item.isDirectory()) {
         fs.mkdirSync(destPath, { recursive: true });
         copyContent(srcPath, destPath);
      }
   }
}

function removeFolderSync(folderPath) {
   const items = fs.readdirSync(folderPath, { withFileTypes: true });

   for (const item of items) {
      const itemPath = path.join(folderPath, item.name);

      if (item.isDirectory()) {
         removeFolderSync(itemPath);
      } else {
         fs.unlinkSync(itemPath);
      }
   }
   fs.rmdirSync(folderPath);
}

copyDir();
