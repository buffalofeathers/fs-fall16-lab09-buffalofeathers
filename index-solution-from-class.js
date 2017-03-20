var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var server = http.createServer(function(req, res) {
    var urlInfo = url.parse(req.url, true);
    
    if (urlInfo.pathname === '/') {
        res.writeHead(200, { "Content-Type" : "text/html" });
        fs.createReadStream('client/index.html').pipe(res);
    } else if (urlInfo.pathname === '/api/chirps') {
        if (req.method === 'GET') {
            res.writeHead(200, {"Content-Type" : "application/json" });
            fs.createReadStream('server/data.json').pipe(res);
        } else if (req.method === 'POST') {
            var incomingChirpData = '';
            req.on('data', function(data) {
                incomingChirpData += data;
                // incomingChirpData = incomingChirpData + data;
            });
            req.on('end', function() {
                var chirp = JSON.parse(incomingChirpData);
                fs.readFile('server/data.json', 'utf8', function(err, data) {
                    if (err) {
                        // do something
                    } else {
                        var chirpArray = JSON.parse(data);
                        chirpArray.push(chirp);
                        fs.writeFile('server/data.json', JSON.stringify(chirpArray), function(err) {
                            if (err) {
                                // do something
                            } else {
                                res.writeHead(201);
                                res.end();
                            }
                        });
                    }
                });
            })
        } else {
            // put, delete requests
        }
    } else {
        // If we make it here, we are essentially just serving files
        var pathInfo = path.parse(urlInfo.pathname);
        var contentType;
        switch (pathInfo.ext) { // Let's switch on the path extension (.txt, .css, .html, etc)
            case '.html':
                contentType = 'text/html';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            default:
                contentType = 'text/plain';
        }

        res.writeHead(200, { "Content-Type" : contentType });
        var readStream = fs.createReadStream('client/' + pathInfo.base);
        readStream.on('error', function(err) {
            res.writeHead(404);
            res.end();
        });
        readStream.pipe(res);
    }
});
server.listen(3000);