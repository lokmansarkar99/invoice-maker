const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
};

const processFile = (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  // Remove the exact 'uppercase' class from classNames
  newContent = newContent.replace(/ className="([^"]*)\buppercase\b([^"]*)"/g, (match, p1, p2) => {
    // If it's just 'uppercase', p1 and p2 might be empty spaces, clean it up
    let newClass = `${p1}${p2}`.replace(/\s+/g, ' ').trim();
    if (newClass) {
      return ` className="${newClass}"`;
    } else {
      return ` className=""`; // Or could remove className entirely, but empty is safe
    }
  });

  // Also replace 'uppercase' if it's in a template literal class
  newContent = newContent.replace(/ className=\{`([^`]*)\buppercase\b([^`]*)`\}/g, (match, p1, p2) => {
    let newClass = `${p1}${p2}`.replace(/\s+/g, ' ').trim();
    return ` className={\`${newClass}\`}`;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

walk(path.join(__dirname, '../src'), processFile);
console.log("Done");
