var fs = require('fs');
var join = require('path').join;
var Util = require(join(__dirname,'../Systemlib','Util.js'));
var util = new Util();

function file() {


    this.routing = "PD.JS.COM_file";

    this.execute = function (para) {
        var response = {"status": 204, "message": ""};

        console.log(" [x] in entity %s", para.toString());
        console.log(" [x] %s", para.taskId);
        console.log(" [x] %s", para.routing);
        console.log(" [x] %s", para.msg);
        console.log(" [x] %s", JSON.stringify(para));

        if (para.Datas == undefined || para.Datas.FilePath == undefined) {
            response.status = 400;
            response.massage = " Datas/FilePath is undefined";
            return response;
        }

        console.log(" [x] para Datas is %s %s", typeof para.Datas, para.Datas.FilePath);

        if ((typeof para.Datas) === 'string') {
            para.Datas = JSON.parse(para.Datas);
        }

        //"D:\\fefe\fef\tmp1.txt"
        var FilePath = util.safePath(para.Datas.FilePath);
        var pathname = util.PathName(FilePath);
        //var toppath = join('E://', 'worktemp');

        var config = util.getConfig();

        if (config == undefined || config.Attachment == undefined || config.Attachment === "") {
            response.message = "没有配置 附件目录";
            return response;
        }

        var toppath = config.Attachment;

        var tagpath = join(toppath, pathname);
        if (pathname != undefined && pathname != "") {
            util.mkdirsSync(tagpath);
            /*
             fs.mkdirSync(join(toppath,pathname), {recursive: true}, function (err) {
             if (err) {
             console.log(err);
             return response;
             }
             });
             */
        }

        var filename = util.FileName(FilePath);
        var tagfile = join(tagpath, filename);

        console.log(" [x] %s", tagfile);


        var dataBuffer = new Buffer(para.Datas.Context, 'base64');
        fs.writeFileSync(tagfile, dataBuffer, 'utf8', function (err) {
            if (err) {
                response.message = JSON.stringify(err);
                return response;
            }
            else {

            }
        });

        response.message = tagfile + " " + "finish";
        response.status = 200;
        return response;

    };
}

module.exports=file;
