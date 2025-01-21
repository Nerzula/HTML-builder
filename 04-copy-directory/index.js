const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
	const src = path.join(__dirname, 'files');
	const build = path.join(__dirname, 'files-copy');

	try {
		if (await exists(build)) {
			await removeFolder(build);
		}

		await fs.mkdir(build, { recursive: true });

		await copyContent(src, build);

		console.log('Copying completed!');
	} catch (error) {
		console.error(`Error during copying: ${error.message}`);
	}
}

async function copyContent(src, dest) {
	const items = await fs.readdir(src, { withFileTypes: true });

	for (const item of items) {
		const srcPath = path.join(src, item.name);
		const destPath = path.join(dest, item.name);

		if (item.isFile()) {
			await fs.copyFile(srcPath, destPath);
		} else if (item.isDirectory()) {
			await fs.mkdir(destPath, { recursive: true });
			await copyContent(srcPath, destPath);
		}
	}
}

async function removeFolder(folderPath) {
	const items = await fs.readdir(folderPath, { withFileTypes: true });

	for (const item of items) {
		const itemPath = path.join(folderPath, item.name);

		if (item.isDirectory()) {
			await removeFolder(itemPath);
		} else {
			await fs.unlink(itemPath);
		}
	}

	await fs.rmdir(folderPath);
}

async function exists(path) {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
}

copyDir();
