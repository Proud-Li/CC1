const cheerio = require('cheerio');
var join = require('path').join;
var Util = require(join(__dirname, '../Systemlib/Util.js'));
var util = new Util();

var incf = require(join(__dirname, '../Systemlib/ncf.js'));
var ncf = new incf();

function crawler_html() {
    this.routing = "PD.JS.crawler_html";

    this.execute = function (para) {
        var response = { "Status": 200, "Message": "" };


        try {
            var url = para.DataId;
            var $ = cheerio.load(para.Datas);
            console.log($("head title").text());

            $("head meta").each(function (i, d) {
                var stmp = $(d).attr("name");
                if (stmp == "keywords") {
                    console.log($(d).attr("content"));
                }
                if (stmp == "description") {
                    console.log($(d).attr("content"));
                }
            });

            //response.Status = 202;

            let arrurl = [];

            //选取带有 style 属性的元素
            $("[style]").each(function (i, d) {
                let stmp = $(d).attr("style");
                if (stmp.indexOf("image") >= 0) {
                    //console.log(typeof stmp);
                    stmp = stmp.split('(')[1].split(')')[0];
                    if (stmp.indexOf('"') > -1) {
                        stmp = stmp.split('"')[1].split('"')[0];
                    }
                    //console.log(stmp);
                    arrurl.push(stmp);
                }
            });

            //选取带有 src 属性的 img 元素
            $("img[src]").each(function (i, d) {
                let stmp = $(d).attr("src");
                //console.log(stmp);
                arrurl.push(stmp);
            });


            arrurl.forEach(function (stmp, i, array) {
                if (stmp.indexOf('http') >= 0) {
                    //pass
                }
                else {
                    var s1 = url.indexOf('https:') >= 0 ? 'https:' : 'http';
                    stmp = s1 + stmp;
                    array[i] = stmp;
                }
            });

            for (let i = 0; i < arrurl.length; i++) {
                //console.log(arrurl[i]);
                setTimeout(() => {
                    var para_file = {
                        "CommandCode": "file",
                        "routing": "PD.JS.COM_file",
                        "DataId": url,
                        "Datas": {
                            "FilePath": arrurl[i],
                            "url": url,
                            "ActionCode": "GetUrlImg"
                        },
                        "remark": ""
                    };
                    //推送
                    ncf.NCFHelp(para_file);
                }, 3000);


                //break;
            }

        }
        catch (e) {
            response.message = e.message;
            console.log(e.message);
        }


        return response;
    }
}


module.exports = crawler_html;
