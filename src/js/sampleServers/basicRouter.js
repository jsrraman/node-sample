'use strict';

const http = require('http');
const url = require('url');
const qs = require('querystring');
const constants = require('./../constants.js');

let routes = {
    'GET': {
        '/': (req, res) => {
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end('<h1> Hello Router </h1>');
        },

        '/api/getItems': (req, res) => {
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(JSON.stringify(req.queryParams));
        }
    },

    'POST': {
        '/api/getItems': (req, res) => {
            let body = '';

            req.on('data', data => {
                body += data;

                console.log(body.length);

                // This is safe guard against the maximum pay load data that can be accepted
                if (body.length > constants.MAX_FILE_UPLOAD_LIMIT) {
                    res.writeHead(413, {'Content-type': 'text/html'});
                    res.end('<h1>' + 'The upper limit of file size to be uploaded is ' +
                        constants.MAX_FILE_UPLOAD_LIMIT + '</h1>');

                    // Destroy the request
                    req.connection.destroy();
                }
            });

            req.on('end', () => {
                //console.log(body);
                let queryParams = qs.parse(body);

                console.log("username->" + queryParams.username);
                console.log("password->" + queryParams.password);

                res.end();
            });
        }
    },

    'NA': (req, res) => {
        res.writeHead(404);
        res.end('Content not found');
    }
}

function router(req, res) {
    //console.log('Request route', req.url);
    //console.log('Request method', req.method);

    // parseQueryString parameter in url.parse method should be true to return
    // the query as an object
    let baseURI = url.parse(req.url, true);
    let resolveRoute = routes[req.method][baseURI.pathname];

    if (resolveRoute != undefined) {
        // Add query parameters to req object for easy access
        req.queryParams = baseURI.query;
        resolveRoute(req, res);
    } else {
        routes['NA'](req, res);
    }

    //res.writeHead(200, {'Content-type': 'text-html'});
    //res.end('<h1>Hello Router</h1>');
}

http.createServer(router).listen(5000, () => {
    console.log('Server running in port 5000');
});