var amqp = require('amqplib/callback_api');

var fs = require('fs');
var join = require('path').join;
var Util = require(join(__dirname,'src/Systemlib','Util.js'));
var util = new Util();

var incf = require(join(__dirname,'src/Systemlib','ncf.js'));
var ncf = new incf();

var url='amqp://'+'pdsr:l818726'+'@192.168.0.102:5672'+'/vhapi';
//var url = util.getConfig().MQUrl;

amqp.connect(url, function(err, conn) {
        if (err) throw err;

        conn.createChannel(function (err, channel) {

            var msg = process.argv.slice(2).join(' ') || "Hello World!";
            /*
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

             */

            for (var i = 0; i < 1; i++) {
                var para = {
                    "CommandCode": "ord",
                    "routing": "PD.JS.COP_Ord",
                    "DataId": "",
                    "Msg": msg + " " + i,
                    "remark": ""
                };

                //推送
                ncf.NCFHelp(para);


                console.log(" [x] Sent '%s'", msg + ' ' + JSON.stringify(para));

            }


        });

        setTimeout(function () {
            conn.close();
            process.exit(0)
        }, 500);
    }
);