const http=require("http");
const https=require("https");
const fs=require("fs");
const sqlite3=require("sqlite3");
const url=require("url");
const colors=require("colors");
//const S1NCM=require("C:\\NCMMonitorV2\\server");

var VisitorDB=new sqlite3.Database("./visitor.db");
var pathMap=JSON.parse(fs.readFileSync("./pathMap.json"));
var certs={cert:fs.readFileSync("./cert/cert.pem"),key:fs.readFileSync("./cert/key.pem")};
Object.keys(pathMap).forEach((key)=>{pathMap[key]=require(pathMap[key]);});


function handleRequest(req,res){
    console.log(req.url.bold.yellow);
	console.log("	Time".bold.green+`		${(new Date())}`);
	console.log("	Host".bold.green+`		${req.headers["host"]}`);
    console.log("	RemoteAddress".bold.green+`	${req.socket.remoteAddress}`);
    console.log("	RemotePort".bold.green+`	${req.socket.remotePort}`);
    console.log("	LocalAddress".bold.green+`	${req.socket.localAddress}`);
    console.log("	LocalPort".bold.green+`	${req.socket.localPort}`);
	console.log("	UserAgent".bold.green+`	${req.headers["user-agent"]}`);
	console.log("");
	VisitorDB.run(
		`INSERT INTO Visitors (ReqDate,ReqTime,ReqURL,ReqHost,RemoteAddress,RemotePort,LocalAddress,LocalPort,UserAgent) VALUES 
			(Date("now","localtime"),Time("now","localtime"),?,?,?,?,?,?,?)`,
		[	req.url,
			req.headers["host"],
			req.socket.remoteAddress,
			req.socket.remotePort,
			req.socket.localAddress,
			req.socket.localPort,
			req.headers["user-agent"]
		]
	);
	
    var reqURL=url.parse(req.url);
    var pathname=reqURL.pathname;
    pathname=pathname.split("/");
    if(pathMap[pathname[1]]){
        pathMap[pathname[1]](req,res,pathname);
    } else {
        res.socket.destroy();
    }
}

var srvHttps=https.createServer(certs,handleRequest
);
srvHttps.listen(443);

var srvHttp=http.createServer(handleRequest);
srvHttp.listen(80);