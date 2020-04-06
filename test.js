
var domain = require("domain");
var EventEmitter = require("events").EventEmitter;

var join = require('path').join;
var Util = require(join(__dirname,'./src/Systemlib','Util.js'));
var util = new Util();

var incf = require(join(__dirname,'src/Systemlib','ncf.js'));
var ncf = new incf();
 
var amqp = require('amqplib/callback_api');
function init(){
    var url=util.getConfig().MQUrl;
    amqp.connect(url, function(err, conn) {
        if (err) throw err;
        conn.createChannel(function (err, channel) {
            var msg = process.argv.slice(2).join(' ');

            for (var i = 0; i < 1; i++) {
                var para = {
                    "CommandCode": "crawler_init",
                    "routing": "PD.JS.crawler_init",
                    "DataId": msg,
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
}


var iEntity = require(join(__dirname,'./src/ComputeEntity','crawler_init.js'));

function init_o1() {

    util.getConfig;

    new iEntity().execute({});

}


function monitor(mymain) {

    var emitter1 = new EventEmitter();

    // 创建域
    var domain1 = domain.create();

    // 隐式绑定
    domain1.run(function () {
        var emitter2 = new EventEmitter();
        emitter2.emit('error',function(){

          return   new Error('fun err');
        });
    });
}

init();