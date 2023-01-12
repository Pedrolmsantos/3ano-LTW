const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Keep-Alive' : 'timeout=5'
    },
    sse: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};
let corpo = {};
const server = http.createServer(function (request, response) {
    const preq = url.parse(request.url,true);
    const pathname = preq.pathname;
    let answer = {};
    corpo = {};
    request.on('data', chunk => {
        data = JSON.parse(chunk);
        switch(request.method) {
            case 'GET':
                doGet(pathname,request,response);
                break;
            case 'POST':
                answer.status = doPost(pathname, data);
                break;
            default:
                answer.status = 400;
        }
        if(answer.status === undefined)
            answer.status = 200;
        if(answer.style === undefined)
            answer.style = 'plain';
        response.writeHead(answer.status, headers[answer.style]);
        response.write(JSON.stringify(content)+'\n');
        if(answer.style === 'plain')
            response.end();

    });
});
    function doGet(pathname, request, response) {
        let answer = {};
        switch (pathname) {
            case '/update':
                answer.style = 'sse';
                break;
            default:
                answer.status = 400;
                break;
        }
        return answer;
    }

    function doPost(pathname, data) {
        switch (pathname) {
            case '/ranking':
                let db = fs.readFileSync("ranking.json");
                db = JSON.parse(db);
                content = db;
                return 200;
            case '/register':
                if (data.nick === undefined) {
                    content = {"error": "User name invalid"};
                    return 401;
                }
                if (data.pass === undefined) {
                    content = {"error": "User password invalid"};
                    return 401;
                }
                if (check_login("dados.json", data) === -1) {
                    corpo = {"error": "User password incorret"};
                    return 400;
                }
                return 200;
            default:
                content = {"error": "Unknown POST request"};
                return 404;
        }
    }
    function check_login(file, data) {
        if (fs.existsSync(file)){
            let db = JSON.parse(fs.readFileSync(file));
            if (db[data.nick] !== undefined) {
                if (db[data.nick] === data.pass) {
                    return 0;
                } else {
                    return -1;
                }
            } else {
                db[data.nick] = data.pass;
                fs.writeSync(file, JSON.stringify(db));
                return 0;
            }
        } else {
            let database = {};
            database[data.nick] = data.pass;
            fs.writeSync(file, JSON.stringify(database));
            return 0;
        }
    }
server.listen(9102);