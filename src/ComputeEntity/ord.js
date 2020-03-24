
var join = require('path').join;
var Util = require(join(__dirname,'../Systemlib','Util.js'));
var util = new Util();

function ord() {


    this.routing = "PD.JS.COP_Ord";

    this.execute = function (para) {
        var response = {"Status": 200, "Message": ""};

        console.log(" [x] in entity %s", para.toString());

        //var para = JSON.parse(para);
        console.log(" [x] %s", para.Msg);
        console.log(" [x] %s", para.taskId);
        console.log(" [x] %s", para.routing);

        response.Message = para.CommandCode + " rep " + para.Msg + " " + util.GUID();

        return response;
    };
}

module.exports=ord;
