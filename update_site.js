const fs = require('fs');
const projects = require('./portfolio_data.json');

// --- Update app.js ---
let appJs = fs.readFileSync('js/app.js', 'utf8');
const projectsRegex = /const projects = \[\s*\{[\s\S]*\}\s*\];/;
const newProjectsCode = `const projects = ${JSON.stringify(projects, null, 4)};`;
// Replace the projects array using a more reliable index-based approach if regex fails
const startIndex = appJs.indexOf('const projects = [');
const endIndex = appJs.indexOf('];', startIndex) + 2;

if (startIndex !== -1 && endIndex !== -1) {
    appJs = appJs.substring(0, startIndex) + newProjectsCode + appJs.substring(endIndex);
    fs.writeFileSync('js/app.js', appJs);
    console.log('Updated app.js');
} else {
    console.error('Failed to find projects array in app.js');
}

// --- Generate HTML snippets ---
let gridHtml = '';
projects.forEach(p => {
    gridHtml += `
                <!-- Project ${p.id} -->
                <article class="project-item" data-project-id="${p.id}">
                    <div class="project-image">
                        <img src="${p.images[0]}" alt="${p.title}">
                    </div>
                    <div class="project-info">
                        <h3>${p.title}</h3>
                        <p>${p.type}</p>
                    </div>
                </article>`;
});

// --- Update portfolio.html ---
let portfolioHtml = fs.readFileSync('portfolio.html', 'utf8');
const portfolioListStart = portfolioHtml.indexOf('<div class="project-list">');
const portfolioListEnd = portfolioHtml.indexOf('</section>', portfolioListStart);

if (portfolioListStart !== -1 && portfolioListEnd !== -1) {
    // Find the end of the div
    let listEndIndex = portfolioHtml.lastIndexOf('</div>', portfolioListEnd);
    portfolioHtml = portfolioHtml.substring(0, portfolioListStart + '<div class="project-list">'.length) + 
                    gridHtml + '\n            </div>\n        ' + 
                    portfolioHtml.substring(portfolioListEnd);
    fs.writeFileSync('portfolio.html', portfolioHtml);
    console.log('Updated portfolio.html');
} else {
    console.error('Failed to find project-list in portfolio.html');
}

// --- Update index.html ---
const featured = [];
const seenCats = new Set();
for (const p of projects) {
    if (!seenCats.has(p.category)) {
        featured.push(p);
        seenCats.add(p.category);
    }
}
for (const p of projects) {
    if (featured.length >= 4) break;
    if (!featured.find(f => f.id === p.id)) {
        featured.push(p);
    }
}

let indexGridHtml = '';
featured.forEach(p => {
    indexGridHtml += `
                <!-- Featured Project ${p.id} -->
                <article class="project-item" data-project-id="${p.id}">
                    <div class="project-image">
                        <img src="${p.images[0]}" alt="${p.title}">
                    </div>
                    <div class="project-info">
                        <h3>${p.title}</h3>
                        <p>${p.type}</p>
                    </div>
                </article>`;
});

let indexHtml = fs.readFileSync('index.html', 'utf8');
const indexListStart = indexHtml.indexOf('<div class="project-list">');
const indexListEnd = indexHtml.indexOf('<div style="text-align: center; margin-top: 4rem;">', indexListStart);

if (indexListStart !== -1 && indexListEnd !== -1) {
    indexHtml = indexHtml.substring(0, indexListStart + '<div class="project-list">'.length) + 
                indexGridHtml + '\n            </div>\n            ' + 
                indexHtml.substring(indexListEnd);
    fs.writeFileSync('index.html', indexHtml);
    console.log('Updated index.html');
} else {
    console.error('Failed to find project-list in index.html');
}
