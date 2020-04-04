
var join = require('path').join;
var Util = require(join(__dirname,'../Systemlib','Util.js'));
var util = new Util();

function ord() {


    this.routing = "PD.JS.COP_Ord";

    this.execute = function (para) {
        var response = {"Status": 200, "Message": ""};

        console.log(" [x] in entity %s", para.toString());

        //var para = JSON.parse(para);
        console.log(" [x] Msg %s", para.Msg);
        console.log(" [x] taskId %s", para.taskId);
        console.log(" [x] routing %s", para.routing);

        response.Message = para.CommandCode + " rep " + para.Msg + " " + util.GUID();

        return response;
    };
}

module.exports=ord;
