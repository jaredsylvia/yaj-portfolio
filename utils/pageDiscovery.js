const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const partialsDirectory = path.join(__dirname, '../views/partials');
const availablePages = [];

function updateAvailablePages() {
    availablePages.length = 0;

    const subdirectories = fs.readdirSync(partialsDirectory, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => item.name);

    subdirectories.forEach(subdir => {
        const subdirPath = path.join(partialsDirectory, subdir);
        const filesInSubdir = fs.readdirSync(subdirPath)
            .filter(file => file.endsWith('.ejs'));

        filesInSubdir.forEach(file => {
            const categoryName = subdir;
            const pageName = file.replace('.ejs', '');

            let transformedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

            if (transformedPageName.match(/[A-Z][a-z]+/g)) {
                transformedPageName = transformedPageName.replace(/([a-z])([A-Z])/g, '$1 $2');
            }

            availablePages.push({ category: categoryName, page: transformedPageName });
        });
    });
}

function watchPartialDirectory() {
    const watcher = chokidar.watch(partialsDirectory, {
        ignored: /(^|[/\\])\../, // Ignore dotfiles
        persistent: true
    });

    watcher.on('all', (event, changedPath) => {
        if (event === 'add' || event === 'unlink') {
            updateAvailablePages();
            console.log('Available pages updated:', availablePages);
        }
    });
}

// Initialize the available pages
updateAvailablePages();

// Watch the partials directory for changes
watchPartialDirectory();

module.exports = {
    availablePages
};
