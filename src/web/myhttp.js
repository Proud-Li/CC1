var fs = require('fs');
var url = require('url');
var join = require('path').join;
var swig = require('swig');

var Util = require(join(__dirname,'../Systemlib','Util.js'));
var util = new Util();

function MyHttp() {
    this.Http = function (app) {

        swig.setDefaults({cache: false});
        app.set('view cache', false);
        app.set('views', '/');
        app.set('view engine', 'html');
        app.engine('html', swig.renderFile);//swig，生成动态文件。相当于jstl之流。
        app.engine('js', swig.renderFile);

        var LOCAL_APP_URL = util.getConfig().LocalAppUrl;

        var APP_NAME = '/myhome';

        if (LOCAL_APP_URL != undefined && LOCAL_APP_URL !== "") {
            app.get(APP_NAME + '/*', function (request, response) {

                try {
                    var temp = request.originalUrl;
                    temp = temp.substr(temp.indexOf(APP_NAME + "/") + APP_NAME.length);

                    if (temp.indexOf("?") >= 0) {
                        temp = temp.substr(0, temp.indexOf("?"));
                    }

                    var fileName = temp.substr(temp.lastIndexOf("/") + 1);
                    var fileType = fileName.indexOf(".") == "-1" ? "html" : fileName.substr(fileName.indexOf(".") + 1);

                    response.type(fileType);
                    //response.set('Content-Type', 'text/html'); //.type的备选方案。.type方法中应该已经做好了映射。
                    if (fileType == "html" || fileType == "js") {
                        response.render(LOCAL_APP_URL + temp, {context: APP_NAME});
                    } else {
                        fs.createReadStream(LOCAL_APP_URL + temp).pipe(response);
                    }

                }
                catch (e) {
                    console.log(" [x] err ", e);
                    response.send(e);
                }

            });
        }

    };
}

module.exports=MyHttp;