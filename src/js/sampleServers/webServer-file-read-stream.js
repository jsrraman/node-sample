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

function fileReader(filePath) {
    return new Promise((resolve, reject) => {
        // The below code creates a stream and the data will be read via even emitters
        // like 'open' and 'error' interfaces of fileStream
        let fileStream = fs.createReadStream(filePath);

        fileStream.on('open', () => {
            resolve(fileStream);
        });

        fileStream.on('error', error => {
            reject(error);
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
        .then(fileStream=> {
            let contentType = mimeTypes[path.extname(filePath)];

            res.writeHead(200, {'Content-type': contentType});

            // res.end will dump the entire content to the client, which is inefficient.
            //res.end(content, 'utf-8');

            // Pipe the streamed content (chunks of data) to the response
            fileStream.pipe(res);
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