const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(projectDist, 'assets');

function buildPage() {
	try {
		createFolder(projectDist);

		buildHTML();

		mergeStyles();

		copyAssets(assetsPath, distAssetsPath);

		console.log('The page assembly is complete!');
	} catch (err) {
		console.error('Error when building the page:', err);
	}
}

function createFolder(folderPath) {
	if (fs.existsSync(folderPath)) {
		fs.rmSync(folderPath, { recursive: true, force: true });
	}
	fs.mkdirSync(folderPath, { recursive: true });
}

function buildHTML() {
	let template = fs.readFileSync(templatePath, 'utf-8');
	const components = fs.readdirSync(componentsPath);

	components.forEach((file) => {
		const ext = path.extname(file);
		const name = path.basename(file, ext);

		if (ext === '.html') {
			const componentContent = fs.readFileSync(path.join(componentsPath, file), 'utf-8');
			template = template.replaceAll(`{{${name}}}`, componentContent);
		}
	});

	fs.writeFileSync(path.join(projectDist, 'index.html'), template, 'utf-8');
}

function mergeStyles() {
	const styleFiles = fs.readdirSync(stylesPath);
	const bundlePath = path.join(projectDist, 'style.css');

	const styles = styleFiles
		.filter((file) => path.extname(file) === '.css')
		.map((file) => fs.readFileSync(path.join(stylesPath, file), 'utf-8'));

	fs.writeFileSync(bundlePath, styles.join('\n'), 'utf-8');
}

function copyAssets(src, dest) {
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest, { recursive: true });
	}

	const items = fs.readdirSync(src, { withFileTypes: true });

	items.forEach((item) => {
		const srcPath = path.join(src, item.name);
		const destPath = path.join(dest, item.name);

		if (item.isDirectory()) {
			copyAssets(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	});
}

buildPage();
