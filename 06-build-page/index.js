const fs = require('fs/promises');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(projectDist, 'assets');

async function buildPage() {
	try {
		await createFolder(projectDist);

		await buildHTML();

		await mergeStyles();

		await copyAssets(assetsPath, distAssetsPath);

		console.log('The page assembly is complete!');
	} catch (err) {
		console.error('Error when building the page:', err.message);
	}
}

async function createFolder(folderPath) {
	try {
		await fs.rm(folderPath, { recursive: true, force: true });
		await fs.mkdir(folderPath, { recursive: true });
	} catch (err) {
		throw new Error(`Couldn't create folder ${folderPath}: ${err.message}`);
	}
}

async function buildHTML() {
	try {
		let template = await fs.readFile(templatePath, 'utf-8');
		const componentFiles = await fs.readdir(componentsPath);

		for (const file of componentFiles) {
			const ext = path.extname(file);
			const name = path.basename(file, ext);

			if (ext === '.html') {
				const componentContent = await fs.readFile(path.join(componentsPath, file), 'utf-8');
				template = template.replaceAll(`{{${name}}}`, componentContent);
			}
		}

		await fs.writeFile(path.join(projectDist, 'index.html'), template, 'utf-8');
	} catch (err) {
		throw new Error(`Error when creating index.html ${err.message}`);
	}
}

async function mergeStyles() {
	try {
		const styleFiles = await fs.readdir(stylesPath);
		const bundlePath = path.join(projectDist, 'style.css');
		const writeStream = await fs.open(bundlePath, 'w');

		for (const file of styleFiles) {
			const ext = path.extname(file);

			if (ext === '.css') {
				const data = await fs.readFile(path.join(stylesPath, file), 'utf-8');
				await writeStream.write(data + '\n');
			}
		}

		await writeStream.close();
	} catch (err) {
		throw new Error(`Error when compiling styles: ${err.message}`);
	}
}

async function copyAssets(src, dest) {
	try {
		await fs.mkdir(dest, { recursive: true });
		const items = await fs.readdir(src, { withFileTypes: true });

		for (const item of items) {
			const srcPath = path.join(src, item.name);
			const destPath = path.join(dest, item.name);

			if (item.isDirectory()) {
				await copyAssets(srcPath, destPath);
			} else {
				await fs.copyFile(srcPath, destPath);
			}
		}
	} catch (err) {
		throw new Error(`Error when copying assets ${err.message}`);
	}
}

buildPage();
