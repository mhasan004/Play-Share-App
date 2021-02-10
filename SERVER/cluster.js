var cluster = require('cluster');
var threadCount = require('os').cpus().length;                                              // Count the machine's threads

if (cluster.isMaster) {                                                                     // parent process
    for (var i = 0; i < threadCount; ++i) {                                                 // creating processes on each thread
        cluster.fork();
    }

    // cluster.on('online', function (worker) {                                                // See what children are online
    //     console.log(`Child Thread ${worker.id} (PID: ${worker.process.pid}) is online`);
    // });

    cluster.on('exit', (worker, code, signal) => {                                          // Listen for dying children
        console.log(`Child Thread ${worker.id} (PID: ${worker.process.pid}) died with code: ${code}, and signal: ${signal}`);
        console.log('Starting new Child Thread');
        cluster.fork();
    });
} else {
    console.log(`Child Thread ${cluster.worker.id} (PID: ${cluster.worker.process.pid}) is online`);
    require('./app');                                                                       // each child process will run our app
}