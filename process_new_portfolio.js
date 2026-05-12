const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, 'portfolio-reorg');
const destDir = path.join(__dirname, 'assets', 'images', 'portfolio');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const categories = ['commercial', 'residential'];
const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.tiff', '.tif'];
const projects = [];
let idCounter = 1;

function cleanName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function titleCase(str) {
    if (!str) return 'Project';
    return str.replace(/[-_]/g, ' ')
              .split(' ')
              .filter(w => w.length > 0)
              .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ');
}

function isLikelyImage(name, isDir) {
    if (isDir) return false;
    const ext = path.extname(name).toLowerCase();
    if (ext === '') return true; // Handling extension-less TIFFs
    return validExtensions.includes(ext);
}

function processDirectory(catPath, category) {
    if (!fs.existsSync(catPath)) return;
    const items = fs.readdirSync(catPath, { withFileTypes: true });
    
    for (const item of items) {
        if (item.name.startsWith('.')) continue;
        
        const fullPath = path.join(catPath, item.name);
        
        if (isLikelyImage(item.name, item.isDirectory())) {
            createProject(path.parse(item.name).name, [fullPath], category);
        } else if (item.isDirectory()) {
            processProjectFolder(item.name, fullPath, category);
        }
    }
}

function processProjectFolder(projectName, projectDir, category) {
    let projectImages = [];
    
    function walk(dir) {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            if (item.name.startsWith('.')) continue;
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                walk(fullPath);
            } else {
                if (isLikelyImage(item.name, item.isDirectory())) {
                    projectImages.push(fullPath);
                }
            }
        }
    }
    
    walk(projectDir);
    
    if (projectImages.length > 0) {
        // Find main image
        let mainIdx = projectImages.findIndex(p => path.parse(p).name.toLowerCase() === 'main');
        if (mainIdx !== -1) {
            // Move main image to front
            const mainImg = projectImages.splice(mainIdx, 1)[0];
            projectImages.unshift(mainImg);
        }
        createProject(projectName, projectImages, category);
    }
}

function createProject(rawName, imagePaths, category) {
    const safeBaseName = cleanName(rawName) || 'project';
    const title = titleCase(rawName);
    const newImages = [];
    
    imagePaths.forEach((srcPath, index) => {
        let ext = path.extname(srcPath).toLowerCase();
        let isTiffOrHeic = false;
        
        // Treat extension-less files as TIFF based on previous 'file' command output
        if (ext === '' || ext === '.tiff' || ext === '.tif' || ext === '.heic') {
            ext = '.jpg';
            isTiffOrHeic = true;
        }
        
        const safeImageName = `${safeBaseName}-${index + 1}${ext}`;
        const destPath = path.join(destDir, safeImageName);
        
        if (isTiffOrHeic) {
            console.log(`Converting ${srcPath} to JPEG...`);
            try {
                execSync(`sips -s format jpeg "${srcPath}" --out "${destPath}"`, { stdio: 'ignore' });
            } catch (e) {
                console.error(`Error converting ${srcPath}`, e);
            }
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
        newImages.push(`assets/images/portfolio/${safeImageName}`);
    });
    
    projects.push({
        id: idCounter++,
        title: title,
        category: category.toUpperCase(),
        type: "Custom Fabrication",
        description: `Selected documentation of ${title}, reflecting rigorous fabrication methods and detailed finish work.`,
        images: newImages
    });
}

categories.forEach(cat => {
    processDirectory(path.join(srcDir, cat), cat);
});

fs.writeFileSync(path.join(__dirname, 'portfolio_data.json'), JSON.stringify(projects, null, 4));
console.log(`Processed ${projects.length} projects.`);
