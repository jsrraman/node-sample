'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let mimeTypes = {
    '.html': 'text/html'
};

function fileAccess(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.F_OK, error => {
            if (!error) {
                resolve(filePath);
            } else {
                reject(error);
            }
        });
    });
}

// The fs.readFile() just reads all the data in memory at one go and
// returns the whole content (not so efficient)
function fileReader(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, content) => {
            if (!error) {
                resolve(content)
            } else {
                reject(error);
            }
        });
    })
}

function webServer(req, res) {
    // parseQueryString parameter in url.parse method should be true to return
    // the query as an object
    let baseURI = url.parse(req.url, true);

    let relativePathName;

    if (baseURI.pathname === '/') {
        relativePathName = '/index.html';
    } else {
        relativePathName = baseURI.pathname;
    }

    // Get the root folder
    let tempIndex = __dirname.indexOf('/src');
    let rootHtmlFolder = __dirname.substring(0, tempIndex) + '/src/html';

    // Compute the actual file path of the html file to be served
    let filePath = rootHtmlFolder + relativePathName;

    fileAccess(filePath)
        .then(fileReader)
        .then(content=> {
            let contentType = mimeTypes[path.extname(filePath)];

            res.writeHead(200, {'Content-type': contentType});
            res.end(content, 'utf-8');
        })
        .catch(()=> {
            // Serve a 404 error
            res.writeHead(404);
            res.end('The server could not access the file requested');
        });
}

http.createServer(webServer).listen(5000, () => {
    console.log('Server running in port 5000');
});