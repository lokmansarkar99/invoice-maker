const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content
      .replace(/bg-amber-/g, 'bg-blue-')
      .replace(/text-amber-/g, 'text-blue-')
      .replace(/border-amber-/g, 'border-blue-')
      .replace(/ring-amber-/g, 'ring-blue-')
      // just in case any purple/violet leaked
      .replace(/bg-violet-/g, 'bg-blue-')
      .replace(/text-violet-/g, 'text-blue-')
      .replace(/border-violet-/g, 'border-blue-')
      .replace(/ring-violet-/g, 'ring-blue-')
      .replace(/bg-purple-/g, 'bg-blue-')
      .replace(/text-purple-/g, 'text-blue-')
      .replace(/border-purple-/g, 'border-blue-')
      .replace(/ring-purple-/g, 'ring-blue-');
      
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated ${filePath}`);
    }
  }
});
