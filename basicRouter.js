'use strict';

const http = require('http');
const url = require('url');

function router(req, res) {
    //console.log('Request route', req.url);
    //console.log('Request method', req.method);

    // parseQueryString parameter in url.parse method should be true to return
    // the query as an object
    let baseURI = url.parse(req.url, true);

    res.writeHead(200, {'Content-type' : 'text-html'});
    res.end('<h1>Hello Router</h1>');
}

http.createServer(router).listen(5000, () => {
    console.log('Server running in port 5000');
});