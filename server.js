var fs = require('fs');
var file = require('path');
var join = require('path').join;

var incf = require(join(__dirname,'Systemlib','ncf.js'));
var ncf = new incf();

const child_process = require('child_process');

var Util = require(join(__dirname,'Systemlib','Util.js'));
var util = new Util();
const LinkConfig = util.getConfig();

function init() {

    if (LinkConfig.WorkStation == undefined || LinkConfig.WorkStation == false) {
        //master 保证启动1个worker 再启动api
        var mq = ncf.rabbitMQ(function () {

            console.log(" [*] 3 Consumer 1 start finish");

            var app = ncf.api();
            var server = app.listen(81, function () {
                var host = server.address().address;
                var port = server.address().port;


                console.log(" [*] 4 api 启动 http://%s:%s", host, port, app.urls);
                console.log(" [*] 启动完成. 退出按(CTRL+C).");
                console.log(" [*] 5 注册其他消费者.");


            });
        });
    }

    //子进程 启动其他 worker
    var ch1 = child_process.fork(join(__dirname, './server_child.js'));
    ch1.on('message', function (msg) {
        console.log(" [*] 3 Consumer 2 ", msg);
    });

    var ch2 = child_process.fork(join(__dirname, './server_child.js'));
    ch2.on('message', function (msg) {
        console.log(" [*] 3 Consumer 3 ", msg);
    });


}

init();


