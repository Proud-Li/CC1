var join = require('path').join;
var Util = require(join(__dirname,'../Systemlib','Util.js'));
var util = new Util();


function git() {
    this.routing = "PD.JS.COM_Git";

    this.execute = function (para) {
        var response = {"Status": 200, "Message": ""};

        console.log(" [x] in entity %s", para.toString());
        console.log(" [x] %s", JSON.stringify(para));




        //var para = JSON.parse(para);
        //console.log(" [x] %s", para.Msg);
        //console.log(" [x] %s", para.taskId);
        //console.log(" [x] %s", para.routing);

        response.Message = para.CommandCode + " rep " + para.Msg + " " + util.GUID();

        return response;
    };

}

module.exports=git;
