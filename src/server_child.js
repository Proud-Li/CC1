
var join = require('path').join;
var incf = require(join(__dirname,'Systemlib','ncf.js'));
var ncf = new incf();

function init(){

    ncf.rabbitMQ(function(){
        process.send("start finish");
    });

}

init();