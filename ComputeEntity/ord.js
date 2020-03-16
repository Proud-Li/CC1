
var join = require('path').join;
var Util = require(join(__dirname,'../Systemlib','Util.js'));
var util = new Util();

function ord() {


    this.routing = "PD.JS.COP_Ord";

    this.execute = function (para) {
        var response = {"status": 200, "massage": ""};

        console.log(" [x] in entity %s", para.toString());

        //var para = JSON.parse(para);
        console.log(" [x] %s", para.msg);
        console.log(" [x] %s", para.taskId);
        console.log(" [x] %s", para.routing);

        response.massage = para.CommandCode + " rep " + para.msg + " " + util.GUID();


        return response;
    };
}{}

module.exports=ord;
