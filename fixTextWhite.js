const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath);
        } else if (f.endsWith('.jsx') || f.endsWith('.js')) {
            let content = fs.readFileSync(dirPath, 'utf8');
            let modified = false;
            
            // Replace text-white with text-slate-900 dark:text-white
            // if it doesn't have dark:text-white and doesn't have a background.
            const newContent = content.replace(/className=(["'])(.*?)\1/g, (match, quote, classes) => {
                if (classes.includes('text-white') && !classes.includes('dark:text-white')) {
                    if (!classes.includes('bg-') && !classes.includes('from-') && !classes.includes('btn-')) {
                        modified = true;
                        return match.replace('text-white', 'text-slate-900 dark:text-white');
                    }
                }
                return match;
            });
            
            if (modified) {
                fs.writeFileSync(dirPath, newContent, 'utf8');
                console.log('Fixed text-white in: ' + f);
            }
        }
    });
}

walkDir(path.join(__dirname, 'frontend', 'src'));
