
var fs = require('fs');
var file = require('path');
var join = require('path').join;


function Util() {

    this.getJsFiles = function (path) {
        var jsfiles = [];
        var files = fs.readdirSync(path);

        files.forEach(function (item) {
            var stat = fs.statSync(join(path, item));
            if (stat.isFile() === true && file.extname(item) === '.js') {
                jsfiles.push(item);
            }
        });
        //console.log(jsfiles);
        return jsfiles;
    }

    this.getConfig = function () {
        try {
            // 同步读取
            var data = fs.readFileSync(join(__dirname, '../config.json'));
            var config = JSON.parse(data.toString());
            if (config == undefined) config = {};
            return config;
        }
        catch (e) {
            console.log(e.message);
            return {};
        }
    };

    this.GUID = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        //return uuid.toUpperCase();
        return uuid;
    };

    this.safePath = function (value) {
        value = value || "";
        while (value.split("\\").length > 1) {
            value = value.replace("\\", "/");
        }
        return value;
    };

    this.FileNameSuffix = function (path) {
        path = path || "";
        // path为文件路径
        var path1 = path.substr(path.lastIndexOf('/') + 1); //文件名称，去掉路径
        var path2 = path1.substring(0, path1.indexOf('.')); //文件名称去掉路径和后缀名

        return path2;
    };

    this.FileName = function (path) {
        var path1 = this.safePath(path);
        path1 = path1.substr(path1.lastIndexOf('/') + 1); //文件名称，去掉路径
        return path1;
    };

    this.PathName = function (path) {
        var path1 = this.safePath(path);

        path1 = path1.substr(path1.indexOf(':') + 1, path.length - 1);

        path1 = path1.substr(0, path1.lastIndexOf('/'));

        return path1;
    };


    // 递归创建目录 同步方法
    this.mkdirsSync =
        function (dirname) {
            if (fs.existsSync(dirname)) {
                return true;
            } else {
                if (this.mkdirsSync(file.dirname(dirname))) {
                    fs.mkdirSync(dirname);
                    return true;
                }
            }
        }
}


module.exports = Util;