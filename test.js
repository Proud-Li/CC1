
var domain = require("domain");
var EventEmitter = require("events").EventEmitter;

var join = require('path').join;
var Util = require(join(__dirname,'./Systemlib','Util.js'));
var util = new Util();


const shell = require("shelljs");

function init() {

    console.log(shell);



    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    }

    shell.echo('hello world');


    // Util.getConfig();

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