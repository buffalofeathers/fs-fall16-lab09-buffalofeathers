var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var server = http.createServer(function(req, res) {
    var urlInfo = url.parse(req.url, true); 
    
    if (urlInfo.pathname === '/'){
        res.writeHead(200, {'Content-Type' : 'html'});
        var indexContent = fs.createReadStream('client/index.html');
        indexContent.pipe(res);
    }   
    else if(urlInfo.pathname === '/api/chirps'){
        if(req.method === 'GET'){
            res.writeHead(200, {'Content-Type' : 'application/json'});
            var jsonContent = fs.createReadStream('server/data.json');
            jsonContent.pipe(res);
        }
        else if(req.method === 'POST'){
            fs.readFile('server/data.json', 'utf8', function(err, data) {
                var parsedReadFile = JSON.parse(data);
                var parsedData = '';
                var receivedChirp = '';

                req.on('data', function(data){
                    receivedChirp += data;
                });

                req.on('end', function(){
                    parsedData = JSON.parse(receivedChirp);
                    parsedReadFile.push(parsedData);
                    var file = JSON.stringify(parsedReadFile);
                    
                    fs.writeFile('server/data.json', file,  function(err) {
                        if (err) {
                            return console.error(err);
                        } else {
                            res.writeHead(201);
                            res.end();
                        };
                    });
                });
            });
            
        }else{};
    }
    else{
        if(path.extname(urlInfo.pathname) === '.css'){
            var cssPath = urlInfo.pathname;
            var styleCss = fs.createReadStream('client/' + cssPath);
            res.writeHead(200, {'Content-Type' : 'text/css'});
            styleCss.pipe(res);
        }
        else if(path.extname(urlInfo.pathname) === '.js'){
            var jsPath = urlInfo.pathname;
            var jsFile = fs.createReadStream('client/' + jsPath);
            res.writeHead(200, {'Content-Type' : 'text/javascript'});
            jsFile.pipe(res);
        }
        else if(path.extname(urlInfo.pathname) === '.html'){
            var htmlPath = urlInfo.pathname;
            var htmlFile = fs.createReadStream('client/' + htmlPath);
            res.writeHead(200, {'Content-Type' : 'text/html'});
            htmlFile.pipe(res);
        }
        else{
            res.writeHead(404);
            res.end('Not Found');
        };
    };
});
server.listen(3000);