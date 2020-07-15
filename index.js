const http = require('http');
const { exec } = require("child_process");
const fs = require('fs').promises;

const directorySources= "files/"

const requestListener = function (req, res) {
    let headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
    };
    res.writeHead(200, headers);

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    }
    
    if (req.method === "GET") {
        res.writeHead(200, headers);
        var response = {
            "token":token()
        }
        res.end(JSON.stringify(response));
        return;
    }
    
    if (req.method === "POST") {
        var data = {}
        req.on("data", function (chunk) {
            var bodyStr = "" + chunk;
            data = JSON.parse(bodyStr);
            console.log("receive data", bodyStr);
        });

        req.on("end", async function () {
            res.writeHead(200,headers);

            var result = await excecuteCode(data.code, data.token);
            console.log("result", result);
            var response = {
                "result":result
            }
            res.end(JSON.stringify(response));
        });
        return;
    }

    res.writeHead(405, headers);
    res.end(`${req.method} is not allowed for the request.`);
}

const server = http.createServer(requestListener);
server.listen(8080);

async function excecuteCode(codeStr, token) {
    const filename = await writePythonFile(codeStr, token);
    if (filename) {
        var result = await runFile(filename);
        return result;
    }
    return "Unkown error"
}

async function writePythonFile(codeStr, token) {
    const filename = directorySources + token +".py"
    try {
        await fs.writeFile(filename, codeStr);
        return filename;
    } catch (error) {
        console.log("error", error);
        return false;
    }
}


async function runFile(filename) {
    var result = await execShellCommand('python3 '+filename);
    return result;
}


async function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}


// GENERATE TOKEN

function rand() {
    return Math.random().toString(36).substr(2);
};

function token() {
    return (rand() + rand()).toString();
};
