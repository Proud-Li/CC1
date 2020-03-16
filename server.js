var fs = require('fs');
var file = require('path');
var join = require('path').join;

var incf = require(join(__dirname,'Systemlib','ncf.js'));
var ncf = new incf();

function getJsFiles(path) {
    var jsfiles = [];
    var files = fs.readdirSync(path);

    files.forEach(function (item) {
        var stat = fs.statSync(join(path, item));
        if (stat.isFile() === true && file.extname(item) === '.js') {
            jsfiles.push(item);
        }
    });
    //console.log(jsfiles);
    return jsfiles;
}



const child_process = require('child_process');

function init() {


    //master 保证启动1个worker 再启动api
    var mq = ncf.rabbitMQ(function () {

        console.log(" [*] 3 Consumer 1 start finish");

        var app = ncf.api();
        var server = app.listen(81, function () {
            var host = server.address().address;
            var port = server.address().port;


            console.log(" [*] 4 api 启动 http://%s:%s", host, port,app.urls);
            console.log(" [*] 启动完成. 退出按(CTRL+C).");
            console.log(" [*] 5 注册其他消费者.");


        });
    });

    //子进程 启动其他 worker
    var ch1 = child_process.fork(join(__dirname,'./server_child.js'));
    ch1.on('message', function (msg) {
        console.log(" [*] 3 Consumer 2 ",msg);
    });

    var ch2 = child_process.fork(join(__dirname,'./server_child.js'));
    ch2.on('message', function (msg) {
        console.log(" [*] 3 Consumer 3 ",msg);
    });



}

function init_v1() {

    ncf.rabbitMQ(
        function (err, conn, channel, callback) {
            if (err) {
                console.log(" [*] error ", err.message);
                return;
            }
            console.log(" [*] 1 MQ 连接 ");


            for (var i = 0; i < 1; i++) {

                var paras = [];

                var path = join(__dirname, 'ComputeEntity');
                getJsFiles(path).forEach(function (item) {
                    var fPath = join(path, item);
                    var iEntity = require(fPath);
                    var entity = new iEntity();

                    var para = {
                        "entity": entity,
                        //"CommandCode": item.replace('.js', ''),
                        "CommandCode": item,
                        "queue": {
                            "routing": entity.routing,
                            "exchange": "JS"
                        }
                    };

                    paras.push(para);

                });


                var index = -1;
                paras.forEach(function (item, i) {
                    var iWorker = require(join(__dirname, 'Systemlib', 'worker.js'));
                    var worker = new iWorker();
                    worker.init(item, channel);

                    //console.log(" [*] worker ",item.CommandCode,i);
                    index = i;
                });
                index++;
                console.log(" [*] 2 worker 启动 Entity*%d", index);

                if (callback != undefined)callback();
            }
        }
        , function () {
            ncf.api(
                function (app, urls) {
                    var server = app.listen(81, function () {
                        var host = server.address().address;
                        var port = server.address().port;

                        console.log(" [*] 3 api 启动 http://%s:%s", host, port, urls);
                        console.log(" [*] 启动完成. 退出按(CTRL+C).");
                    });
                }
            );
        }
    );


}

init();


