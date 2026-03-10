const fs = require('fs');
const path = require('path');

const srcDir = '/Users/johnmeagher/Desktop/_antigravity/_fCreative_V1/Portfolio/sito.2';
const destDir = '/Users/johnmeagher/Desktop/_antigravity/_fCreative_V1/assets/images/portfolio';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const categoryMap = {
    'commercial': 'WORK',
    'residential': 'LIVING',
    'sculpture': 'BESPOKE',
    'Our stuff': 'COLLECTION'
};

const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'];

let projects = [];
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

function processDirectory(dir, category, projectNameOverride = null) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    let imagesForCurrentDir = [];
    
    for (const item of items) {
        if (item.name.startsWith('.')) continue;
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
             const projectName = item.name;
             processProject(projectName, fullPath, category);
        } else {
             const ext = path.extname(item.name).toLowerCase();
             if (validExtensions.includes(ext)) {
                 imagesForCurrentDir.push(fullPath);
             }
        }
    }
    
    if (imagesForCurrentDir.length > 0 && !projectNameOverride) {
        for (const imgPath of imagesForCurrentDir) {
           const basename = path.basename(imgPath, path.extname(imgPath));
           createProject(basename, [imgPath], category);
        }
    } else if (imagesForCurrentDir.length > 0 && projectNameOverride) {
        createProject(projectNameOverride, imagesForCurrentDir, category);
    }
}

function processProject(projectName, projectDir, category) {
    let projectImages = [];
    
    function walk(dir) {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            if (item.name.startsWith('.')) continue;
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                walk(fullPath);
            } else {
                const ext = path.extname(item.name).toLowerCase();
                if (validExtensions.includes(ext)) {
                    projectImages.push(fullPath);
                }
            }
        }
    }
    
    walk(projectDir);
    
    if (projectImages.length > 0) {
        createProject(projectName, projectImages, category);
    }
}

function createProject(rawName, imagePaths, category) {
    const safeBaseName = cleanName(rawName);
    const title = titleCase(rawName);
    const newImages = [];
    
    imagePaths.forEach((srcPath, index) => {
        const ext = path.extname(srcPath).toLowerCase();
        const safeImageName = `${safeBaseName}-${index + 1}${ext}`;
        const destPath = path.join(destDir, safeImageName);
        
        fs.copyFileSync(srcPath, destPath);
        newImages.push(`assets/images/portfolio/${safeImageName}`);
    });
    
    projects.push({
        id: idCounter++,
        title: title,
        category: category,
        type: "Custom Fabrication", // Note: This can be customized later if needed
        description: `Selected documentation of ${title}, reflecting rigorous fabrication methods and detailed finish work.`,
        images: newImages
    });
}

for (const [folder, cat] of Object.entries(categoryMap)) {
    const dirPath = path.join(srcDir, folder);
    if (fs.existsSync(dirPath)) {
        processDirectory(dirPath, cat);
    }
}

fs.writeFileSync('/Users/johnmeagher/Desktop/_antigravity/_fCreative_V1/portfolio_data.json', JSON.stringify(projects, null, 2));
console.log(`Processed ${projects.length} projects.`);
