var fs = require('fs');
var request = require('request');

var join = require('path').join;
var Util = require(join(__dirname, '../Systemlib/Util.js'));
var util = new Util();

var incf = require(join(__dirname, '../Systemlib/ncf.js'));
var ncf = new incf();

function file() {
    this.routing = "PD.JS.COM_file";

    this.execute = function (para) {
        var response = { "Status": 204, "Message": "" };

        //console.log(" [x] in entity %s", para.toString());
        //console.log(" [x] %s", para.queue.taskId);
        //console.log(" [x] %s", para.routing);
        //console.log(" [x] %s", para.Msg);
        //console.log(" [x] %s", JSON.stringify(para));

        if (para.Datas == undefined || para.Datas.FilePath == undefined) {
            response.Status = 400;
            response.Message = " Datas/FilePath is undefined";
            return response;
        }

        //console.log(" [x] para Datas is %s %s", typeof para.Datas, para.Datas.FilePath);

        if ((typeof para.Datas) === 'string') {
            para.Datas = JSON.parse(para.Datas);
        }

        //"D:\\fefe\fef\tmp1.txt"
        var FilePath = util.safePath(para.Datas.FilePath);
        var pathname = util.PathName(FilePath);
        //var toppath = join('E://', 'worktemp');

        var config = util.getConfig();

        if (config == undefined || config.Attachment == undefined || config.Attachment === "") {
            response.Message = "没有配置 附件目录";
            return response;
        }

        var toppath = config.Attachment;
        var filename = util.FileName(FilePath);

        if (para.Datas.ActionCode === "GetUrlImg") {
            pathname = '20200408';
            pathname = new Date().toJSON().replace('-','').replace('-','');
            pathname = pathname.substring(0, pathname.indexOf('T'));
        }
        var tagpath = join(toppath, pathname);


        if (pathname != undefined && pathname != "") {
            //util.mkdirsSync(tagpath);
            fs.mkdirSync(tagpath, { recursive: true }, function (err) {
                if (err) {
                    console.log(err);
                    return response;
                }
            });
        }
        var tagfile = join(tagpath, filename);
        //console.log(" [x] tagfile %s", tagfile);

        if (para.Datas.ActionCode === "GetUrlImg") {
            request(para.Datas.FilePath).pipe(fs.createWriteStream(tagfile));
        }
        else {
            var dataBuffer = new Buffer.from(para.Datas.Context, 'base64');
            fs.writeFileSync(tagfile, dataBuffer, 'utf8', function (err) {
                if (err) {
                    response.Message = JSON.stringify(err);
                    return response;
                }
                else {
                }
            });
        }

        //if (para.Datas.ActionCode != undefined && para.Datas.ActionCode == "git") {
        //    para.CommandCode = "git";
        //    para.routing = "PD.JS.COM_Git";
        //    para.Datas.Tagfile = tagfile;
        //    para.Datas.Context = "";
        //
        //    ncf.MCFHelp(para);
        //}

        response.Message = tagfile + " " + "finish";
        response.Status = 200;
        return response;

    };
}

module.exports = file;
