const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend', 'src');

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath);
        } else if (f.endsWith('.js') || f.endsWith('.jsx')) {
            let content = fs.readFileSync(dirPath, 'utf8');
            let originalContent = content;

            // Replace single quotes
            content = content.replace(/'http:\/\/localhost:5000\//g, "import.meta.env.VITE_API_URL + '/");
            
            // Replace backticks
            content = content.replace(/`http:\/\/localhost:5000\//g, "`${import.meta.env.VITE_API_URL}/");

            // Replace double quotes (just in case)
            content = content.replace(/"http:\/\/localhost:5000\//g, 'import.meta.env.VITE_API_URL + "/');

            if (content !== originalContent) {
                fs.writeFileSync(dirPath, content, 'utf8');
                console.log(`Updated: ${dirPath}`);
            }
        }
    });
}

walkDir(directoryPath);
console.log("URL replacement complete!");
