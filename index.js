const http = require('http');
const { exec } = require("child_process");
const fs = require('fs').promises;

const requestListener = function (req, res) {

    if (req.method === "GET") {
        res.writeHead(200);
        res.end('Backed Code as a Service');
    }

    else if (req.method === "POST") {
        var data = {}
        req.on("data", function (chunk) {
            var bodyStr = "" + chunk;
            data = JSON.parse(bodyStr);
        });

        req.on("end", async function () {
            res.writeHead(200, { "Content-Type": "application/json" });
            console.log("body", data);
            var result = await excecuteCode(data.code);
            var response = {
                "result":result
            }
            res.end(JSON.stringify(response));
        });
    }
}

const server = http.createServer(requestListener);
server.listen(8080);


async function excecuteCode(codeStr) {
    console.log("excecute", codeStr);
    var write = await writePythonFile(codeStr);
    if(write){
        var result = await runFile();
        return result;
    }
    return "Unkown error"
}

async function writePythonFile(codeStr) {
    try {
        await fs.writeFile('code.py', codeStr);
        return true;
    } catch (error) {
        console.log("error", error);
        return false;
    }
}


async function runFile() {
    var result = await execShellCommand('python3 code.py');
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