var amqp = require('amqplib/callback_api');

var fs = require('fs');
var file = require('path');
var join = require('path').join;

var express = require('express');
var app = express();
var bodyParser= require('body-parser');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}));

var Util = require(join(__dirname,'../Systemlib','Util.js'));
var util = new Util();

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

function MQ(execute, callback) {
    var url = util.getConfig().MQUrl;

    amqp.connect(url, function (err, conn) {
        if (err) {
            execute(err);
            return;
        }

        conn.createChannel(function (err2, channel) {
            if (err) {
                execute(err2);
                return;
            }
            execute(err2, conn, channel, callback);
        });
    });
}

function ncf() {
    this.rabbitMQ = function (callback) {
        var url = util.getConfig().MQUrl;

        amqp.connect(url, function (err, conn) {
            if (err) return;


            conn.createChannel(function (err2, channel) {
                if (err2) return;
                console.log(" [*] 1 MQ 连接 ");


                var paras = [];

                var path = join(__dirname, '../ComputeEntity');
                getJsFiles(path).forEach(function (item) {
                    var fPath = join(path, item);
                    var iEntity = require(fPath);
                    var entity = new iEntity();

                    var para = {
                        "entity": entity,
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
                    var iWorker = require(join(__dirname, '../Systemlib', 'worker.js'));
                    var worker = new iWorker();
                    worker.init(item, channel);

                    //console.log(" [*] worker ",item.CommandCode,i);
                    index = i;
                });
                index++;
                console.log(" [*] 2 worker 启动 Entity*%d", index);

                if (callback != undefined)callback();
            });

        });

    };

    this.api = function () {

        //设置跨域访问
        app.all('*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            res.header("X-Powered-By", ' 3.2.1');
            res.header("Content-Type", "application/json;charset=utf-8");
            next();
        });



        var urls = [];

        var stmp = '/api/datasync';
        app.post(stmp, function (req, res) {
            var para = req.body;
            para.taskId = util.GUID();

            if (para.routing != undefined && para.routing != "") {
                MQ(function (err, conn, channel) {
                    //消息持久化
                    var exchange = 'pd.direct';
                    channel.assertExchange(exchange, 'direct', {durable: true});
                    channel.publish(exchange, para.routing, new Buffer(JSON.stringify(para)), {persistent: true});
                });
                res.send({"status": 200, "massage": " "});
            }
            else {
                //直接同步调用
                var iEntity = require(join(__dirname, '../ComputeEntity', para.CommandCode));
                var response = new iEntity().execute(para);
                res.send(response);

                console.log(" [x] api Done");
            }
        });
        urls.push(stmp);

        stmp = '/api/test';
        app.post(stmp, function (req, res) {
            var para = req.body;
            res.send(para);
        });
        urls.push(stmp);

        stmp = '/api/connect';
        app.post(stmp, function (req, res) {
            var para = req.body;
            para.connect = 'success';
            res.send(para);
        });
        urls.push(stmp);

        var MyHttp = require(join(__dirname, '../web', 'myhttp.js'));
        var myhttp = new MyHttp();
        myhttp.Http(app);

        app.urls = urls;

        return app;
    };
}

module.exports=ncf;
