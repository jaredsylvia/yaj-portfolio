const express = require('express');
const path = require('path');
const fs = require('fs');
const { parseCacheDuration } = require('../utils/cacheDurationParser.js');

const serveWithCache = (app) => {
  const publicDir = path.join(__dirname, '../public');
  const subdirectories = fs.readdirSync(publicDir, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name);

  subdirectories.forEach(subdir => {
    const cacheDuration = parseCacheDuration(subdir);
    const subDirPath = path.join(publicDir, subdir);
    
    // Iterate through files and directories within the cache subdirectory
    const filesAndDirs = fs.readdirSync(subDirPath, { withFileTypes: true });
    filesAndDirs.forEach(item => {
      if (item.isFile()) {
        // Serve individual files under /public
        app.use(`/${item.name}`, express.static(path.join(subDirPath, item.name), { maxAge: cacheDuration }));
      } else if (item.isDirectory()) {
        // Serve entire subdirectories under /public
        app.use(`/${item.name}`, express.static(path.join(subDirPath, item.name), { maxAge: cacheDuration }));
      }
      console.log(`Serving ${item.name} with a max-age of ${cacheDuration} ms`);
    });
  });

  app.use('/public', express.static(publicDir));
  
  return app;
};

module.exports = serveWithCache;
