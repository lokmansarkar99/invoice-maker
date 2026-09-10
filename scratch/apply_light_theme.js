const fs = require('fs');
const path = require('path');

const replacements = [
  ['bg-black/80', 'bg-black/80 light:bg-white/90'],
  ['bg-black/50', 'bg-black/50 light:bg-slate-50'],
  ['bg-black', 'bg-black light:bg-slate-50'],
  ['text-cyan-300', 'text-cyan-300 light:text-slate-800'],
  ['text-cyan-400', 'text-cyan-400 light:text-slate-900'],
  ['text-cyan-500', 'text-cyan-500 light:text-slate-500'],
  ['text-cyan-600', 'text-cyan-600 light:text-slate-500'],
  ['text-cyan-700', 'text-cyan-700 light:text-slate-400'],
  ['text-cyan-800', 'text-cyan-800 light:text-slate-400'],
  ['text-cyan-900', 'text-cyan-900 light:text-slate-300'],
  ['border-cyan-500/50', 'border-cyan-500/50 light:border-slate-200'],
  ['border-cyan-500/30', 'border-cyan-500/30 light:border-slate-200'],
  ['border-cyan-900', 'border-cyan-900 light:border-slate-200'],
  ['border-cyan-800', 'border-cyan-800 light:border-slate-200'],
  ['bg-cyan-950/50', 'bg-cyan-950/50 light:bg-slate-100'],
  ['bg-cyan-950/30', 'bg-cyan-950/30 light:bg-slate-50'],
  ['bg-cyan-900/50', 'bg-cyan-900/50 light:bg-slate-100'],
  ['hover:border-cyan-400', 'hover:border-cyan-400 light:hover:border-indigo-400'],
  ['hover:bg-cyan-900/50', 'hover:bg-cyan-900/50 light:hover:bg-indigo-50'],
  ['hover:text-cyan-300', 'hover:text-cyan-300 light:hover:text-indigo-700'],
  ['hover:text-cyan-400', 'hover:text-cyan-400 light:hover:text-indigo-600'],
  ['focus:border-cyan-400', 'focus:border-cyan-400 light:focus:border-indigo-400'],
  ['group-focus-within:text-cyan-400', 'group-focus-within:text-cyan-400 light:group-focus-within:text-indigo-600'],
  ['shadow-[0_0_30px_rgba(6,182,212,0.3)]', 'shadow-[0_0_30px_rgba(6,182,212,0.3)] light:shadow-md'],
  ['shadow-[0_0_20px_rgba(6,182,212,0.4)]', 'shadow-[0_0_20px_rgba(6,182,212,0.4)] light:shadow-lg'],
  ['shadow-[0_0_15px_rgba(6,182,212,0.2)]', 'shadow-[0_0_15px_rgba(6,182,212,0.2)] light:shadow-md'],
  ['shadow-[0_0_15px_rgba(6,182,212,0.3)]', 'shadow-[0_0_15px_rgba(6,182,212,0.3)] light:shadow-md'],
  ['shadow-[0_0_15px_rgba(6,182,212,0.4)]', 'shadow-[0_0_15px_rgba(6,182,212,0.4)] light:shadow-md'],
  ['bg-red-950/50', 'bg-red-950/50 light:bg-red-50'],
  ['bg-red-950/30', 'bg-red-950/30 light:bg-red-50'],
  ['border-red-500/50', 'border-red-500/50 light:border-red-200'],
  ['text-red-400', 'text-red-400 light:text-red-600'],
  ['bg-green-950/50', 'bg-green-950/50 light:bg-emerald-50'],
  ['text-green-400', 'text-green-400 light:text-emerald-600'],
  ['border-green-500/50', 'border-green-500/50 light:border-emerald-200'],
  ['font-mono', 'font-mono light:font-sans'],
  ['tracking-widest', 'tracking-widest light:tracking-normal'],
  ['tracking-wider', 'tracking-wider light:tracking-normal']
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We only want to replace within className="..."
  // This is a naive regex but usually works for standard Next.js Tailwind projects
  const classNameRegex = /className="([^"]+)"/g;
  
  content = content.replace(classNameRegex, (match, classString) => {
    let newClassString = classString;
    
    // Sort replacements by length descending so we don't partially replace overlapping strings
    const sortedReplacements = [...replacements].sort((a, b) => b[0].length - a[0].length);

    sortedReplacements.forEach(([target, replacement]) => {
      // Check if target exists but replacement is not already there
      if (newClassString.includes(target) && !newClassString.includes(replacement)) {
        // use regex to replace exact whole words where appropriate or exact substring
        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const targetRegex = new RegExp(`(?<=^|\\s)${escapeRegExp(target)}(?=\\s|$)`, 'g');
        newClassString = newClassString.replace(targetRegex, replacement);
      }
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
