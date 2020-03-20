var join = require('path').join;
var Util = require(join(__dirname,'../Systemlib','Util.js'));
var util = new Util();
var shell = require('shelljs');

function git() {
    this.routing = "PD.JS.COM_Git";
    this.execute = function (para) {
        var response = {"Status": 200, "Message": ""};

        if (!shell.which('git')) {
            shell.echo('Sorry, this script requires git');

            response.Data = 'Sorry, this script requires git';
            shell.exit(1);
        }

        shell.cd(util.getConfig().GitPath);
        //shell.cd('E://worktemp//Users//lizh//EBC//link');

        if (para.gitCommandCode == undefined || para.gitCommandCode == "") {
            para.gitCommandCode = "git --help";
        }

        var xrtn = shell.exec(para.gitCommandCode);
        response.Data = JSON.parse(JSON.stringify(xrtn));
        return response;
    };
}

module.exports=git;
