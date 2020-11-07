var cluster = require('cluster');
var threadCount = require('os').cpus().length;                                              // Count the machine's threads


if (cluster.isMaster) {                                                                     // parent process
    for (var i = 0; i < threadCount; ++i) {                                                 // create threads based on thread count
        cluster.fork();
    }

    cluster.on('online', function (worker) {                                                // See what children are online
        console.log('Child Thread ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', (worker, code, signal) => {                                          // Listen for dying workers
        console.log('Child Thread ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting new Child Thread');
        cluster.fork();
    });
} else {
    require('./app');                                                                       // each thread will run out app
}