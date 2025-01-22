const fs = require('fs/promises');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');

async function processFolder(currentFolder) {
	try {
		const items = await fs.readdir(currentFolder, { withFileTypes: true });

		for (const item of items) {
			if (item.isFile()) {
				const filePath = path.join(currentFolder, item.name);
				const { name, ext } = path.parse(item.name);

				const stat = await fs.stat(filePath);
				const size = (stat.size / 1024).toFixed(2);

				console.log(`${name} - ${ext.slice(1)} - ${size}kb`);
			}
		}
	} catch (err) {
		console.error(`Error processing folder "${currentFolder}": ${err.message}`);
	}
}

processFolder(folder);
