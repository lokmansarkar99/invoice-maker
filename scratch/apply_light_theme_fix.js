const fs = require('fs');
const path = require('path');

const replacements = [
  // Sidebar fix
  ['bg-black/90', 'bg-black/90 light:bg-white'],
  
  // Contrast fixes: Make grays darker for better readability
  ['light:text-slate-500', 'light:text-slate-700'],
  ['light:text-slate-400', 'light:text-slate-600'],
  ['light:text-slate-800', 'light:text-slate-900'],
  
  // Make borders a bit more visible
  ['light:border-slate-200', 'light:border-slate-300'],
  ['light:border-slate-100', 'light:border-slate-300'],
  
  // Make backgrounds a bit more distinct
  ['light:bg-slate-50', 'light:bg-white'],
  ['light:bg-white/90', 'light:bg-white'],
  
  // Sidebar active item was bg-cyan-950/50 light:bg-slate-100 text-cyan-300 light:text-slate-800
  // Let's make it more distinct
  ['light:bg-slate-100', 'light:bg-slate-200'],
  
  // Any stray bg-black that missed light mode
  ['bg-black/95', 'bg-black/95 light:bg-white'],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const classNameRegex = /className="([^"]+)"/g;
  
  content = content.replace(classNameRegex, (match, classString) => {
    let newClassString = classString;
    
    // Sort replacements by length descending
    const sortedReplacements = [...replacements].sort((a, b) => b[0].length - a[0].length);

    sortedReplacements.forEach(([target, replacement]) => {
      // replace all occurrences of target
      newClassString = newClassString.split(target).join(replacement);
      
      // cleanup any duplicate light: classes that might have been created
      // e.g. light:bg-white light:bg-white
      const parts = newClassString.split(' ');
      const uniqueParts = [...new Set(parts)];
      newClassString = uniqueParts.join(' ');
    });

    return `className="${newClassString}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

const dirsToProcess = [
  path.join(__dirname, '../src/app/admin'),
  path.join(__dirname, '../src/app/invoice'),
  path.join(__dirname, '../src/components/admin'),
  path.join(__dirname, '../src/components')
];

dirsToProcess.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Scanning ${dir}...`);
    walkDir(dir);
  }
});
