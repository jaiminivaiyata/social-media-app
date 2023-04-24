"use strict";

const app = require("./src/app");
const http = require("http");
const cluster = require("cluster");
const {cpus} = require("os");
const config = require("./src/general-resources/config");


const port = config.port;
app.set("port", port);


const startWorker = (processId) => {
    console.log(`Worker ${processId} started`);

    // Workers can share any TCP connection
    // In this case it is an HTTP server

    http.createServer(app)
        .listen(port)
        .on("error", onError)
        .on("listening", onListening);
};

// Event listener for HTTP server "error" event.

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ?
        "Pipe " + port :
        "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    console.log("server is up and running on port : ", port);
}


// clustering to utilize all cores of the CPU
if (cluster.isPrimary) {

    // Get core CPUs available.
    const numCPUs = cpus().length;

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    startWorker(process.pid);
}

