
var domain = require("domain");
var EventEmitter = require("events").EventEmitter;

function init() {


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