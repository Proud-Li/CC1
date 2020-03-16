var amqp = require('amqplib/callback_api');

var url='amqp://'+'pdsr:l123456'+'@localhost:5672'+'/vhapi';

var fs = require('fs');
var join = require('path').join;
var Util = require(join(__dirname,'Systemlib','Util.js'));
var util = new Util();

amqp.connect(url, function(err, conn) {
        if (err) throw err;

        conn.createChannel(function (err, channel) {

            var msg = process.argv.slice(2).join(' ') || "Hello World!";

            var data = fs.readFileSync('g:/tmp.txt');
            //var bufferData = new Buffer(data,'base64');
            var contextbase64 = data.toString('base64');

            var para = {
                "CommandCode": "file",
                "routing": "PD.JS.COM_file",
                //"Datas": {"FilePath": "D:\\Users\\lizh2\\tmp.txt","Context": contextbase64},
                //"Datas": JSON.stringify({"FilePath": "you/file/path/tmp.txt", "Context": contextbase64}),
                "Datas": {"FilePath": "you/file/path/tmp.txt", "Context": contextbase64},
                "Msg": msg,
                "taskId": util.GUID()
            };

            //channel.sendToQueue(q, new Buffer('Hello World!'));
            //消息持久化
            channel.sendToQueue(para.routing, new Buffer(JSON.stringify(para)), {persistent: true});
            console.log(" [x] Sent '%s'", msg + ' ' + JSON.stringify(para));


        });

        setTimeout(function () {
            conn.close();
            process.exit(0)
        }, 500);
    }
);