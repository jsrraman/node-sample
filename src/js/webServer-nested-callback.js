'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let mimeTypes = {
    '.html' : 'text/html'
};

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

    // Check if the requested file exists
    fs.access(filePath, fs.F_OK, error => {
        if (!error) {
            // File exists, read and serve the content
            fs.readFile(filePath, (error, content) => {
                if (!error) {
                    // Resolve the content type
                    // Serve the file from the buffer
                    let contentType = mimeTypes[path.extname(filePath)];
                    res.writeHead(200, {'Content-type': contentType});
                    res.end(content, 'utf-8');
                } else {
                    // Serve a 500 error
                    res.writeHead(500);
                    res.end('The server could not read the file requested');
                }
            })
        } else {
            // Serve a 404 error
            res.writeHead(404);
            res.end('File not found');
        }
    });
}

http.createServer(webServer).listen(5000, () => {
    console.log('Server running in port 5000');
});