// https://www.youtube.com/watch?v=Hbt56gFj998
// Download redis to pc:
    // linux: sudo apt-get install redis-server
    cd ~
    wget https://download.redis.io/releases/redis-6.0.9.tar.gz
    tar xzf redis-6.0.9.tar.gz
    cd redis-6.0.9
    make                                            // press enter
    make test
    
    // USING
        redis-server                            // run the server                                        or  src/redis-server  

        redis-cli                               // interact with redis directly in terminal              or  src/redis-cli 
            redis> set foo bar                      // OK  (setting foo = bar)
            redis> get foo                          // bar (getting foo -> bar)
    // test in cli:
    ping

//________________________SUMMARY__________________________
    // get/set basic
    set key val             // ddidnt use <> cus it messses up color
    get <key>
    incr <key>              // val++
    decr <key>              // val--  
    exists <key> 
    del <key> 
    del <key>
    flushall
    set server:port 8000
    get server:port 
//________________________EX__________________________
    // get/set:
        set var1 100
        get var                         // 100          // nill if empty

        incr var1       // var1++
        decr var1       // var1--
        
        exists var1     // 1 or 0

        del var1        // 1 is success    
        flushall        // delete all
        
        // get/set with with keys with :
        set server:name1 someserver
        get server:name1                    //"someserver"      

        set server:port 8000
        get server:port                     //"8000"  

    // expire - time - get/set
        // expire - time
        expire var2 50                      // 1 or 0 as success. 50 sec then expire     
        ttl  var                            // how much time in sec left to expire?

        // set a value and expiration
        setex greeting 30 "hello"           // setx <key> <expTimeInSec> <value>        
        client.set(key, value, 'EX', 60*60*24, (err,data)=>{});                     //SETNX, SETEX, PSETEX  depreciated          


        // remove expiration timer from key
        persist varName

    // other
        mset key1 "hell1" key2 "world"              // set 2 keys
        append key1 " world"                        // append a val to another 
        rename key1 greeting                        // rename key1 to greeting

    // list



//____________ Redis in express:
    //redis_db.js
        const redis        = require('redis')                                                               // (npm install redis, redis-server) in-memory, persistent data structure store to store key value pairs         
        const REDIS_PORT   = process.env.REDIS_PORT || 6379
        var REDIS_CLIENT = redis.createClient(REDIS_PORT)
        module.exports = {
            REDIS_CLIENT: REDIS_CLIENT
        }
    // use.js
        const {REDIS_CLIENT} = require('redis_db')

        // use
        REDIS_CLIENT.set("test", "val", (err)=>{
            if(err){ return console.log("NOOOO"+err)}
        })

        REDIS_CLIENT.get('test', (err, val) => {
            if (err) { 
                return console.error(err) 
            }
            console.log('val is: ', val)
        })


