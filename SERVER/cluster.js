var cluster = require('cluster');
var threadCount = require('os').cpus().length;                                             // Count the machine's threads


if (cluster.isMaster) {
    // Create a worker for each CPU
    for (var i = 0; i < threadCount; ++i) { 
        cluster.fork();
    }

    // See what workers are online
    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    // Listen for dying workers
    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    require('./app');                                                                  // our app
}