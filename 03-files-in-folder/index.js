const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');
const files = fs.readdirSync(folder, { withFileTypes: true });

files.forEach((item) => infoFile(item, folder));

function infoFile(item, currentFolder) {
   const filePath = path.join(currentFolder, item.name);

   if (item.isFile()) {
      const { name, ext } = path.parse(item.name);
      const stat = fs.statSync(filePath);
      const size = (stat.size / 1024).toFixed(2);
      console.log(`${name} - ${ext.slice(1)} - ${size}kb`);
   } else if (item.isDirectory()) {
      const subFiles = fs.readdirSync(filePath, { withFileTypes: true });
      subFiles.forEach((subItem) => infoFile(subItem, filePath));
   }
}
