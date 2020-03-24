var amqp = require('amqplib/callback_api');

var url='amqp://localhost';
url= 'amqp://'+'pdsr:l123456'+'@localhost:5672'+'/vhapi';

var join = require('path').join;

function worker() {
    this.init = function (para, channel) {


        var exchange = 'pd.direct';
        channel.assertExchange(exchange, 'direct', {durable: true});

        var routing = para.queue.routing;

        channel.assertQueue(
            routing
            , {durable: true}
            , function (err, q) {
                channel.bindQueue(q.queue, exchange, routing);
            }
        );

        channel.prefetch(1);


        channel.consume(
            routing
            , function (msg) {
                var secs = msg.content.toString().split('.').length - 1;

                //console.log(" [x] Received %s", msg.content.toString());

                var response = {"Status": 0, "Message": ""};

                try {
                    //指令 调用
                    var tpara = JSON.parse(msg.content);
                    var iEntity = require(join(__dirname, '../ComputeEntity', tpara.CommandCode));
                    response.Status = 200;
                    response = new iEntity().execute(tpara);

                    //计算实体 调用
                    //response = para.entity.execute(tpara);
                }
                catch (e) {
                    response.Status = 500;
                    response.Message = e.Message || 'not msg '+para.CommandCode;


                    if (para.CommandCode === tpara.CommandCode) {
                    }
                    else
                    {
                        response.Status = 404;
                        response.Message = 'not exists CommandCode ' + tpara.CommandCode;
                    }

                    response.Status = e.Status;

                    console.log(" [x] ask ", e);

                }

                //console.log(" [x] ask ", response);
                //console.log(" [x] ask %s", JSON.stringify(response));

                if (response.Status === 400 ||
                    response.Status === 404 || response.Status === 200) {
                    setTimeout(function () {
                        console.log(" [x] Done");
                        channel.ack(msg);
                    }, secs * 1000);
                }
            }
            , {noAck: false}
        );

    };
}

module.exports=worker;