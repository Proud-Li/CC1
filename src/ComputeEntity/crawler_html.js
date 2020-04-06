const cheerio = require('cheerio');
var join = require('path').join;
var Util = require(join(__dirname, '../Systemlib', 'Util.js'));
var util = new Util();

var incf = require(join(__dirname, '../Systemlib', 'ncf.js'));
var ncf = new incf();

function crawler_html() {
    this.routing = "PD.JS.crawler_html";

    this.execute = function (para) {
        var response = { "Status": 200, "Message": "" };


        try {
            var $ = cheerio.load(para.datas);
            //console.log(para.datas);

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

            response.Status = 202;

            //选取带有 style 属性的元素
            $("[style]").each(function (i, d) {
                let stmp = $(d).attr("style");
                if (stmp.indexOf("image")>=0)
                {
                    //console.log(typeof stmp);
                    stmp = stmp.split('(')[1].split(')')[0];
                    if(stmp.indexOf('"') > -1){
                        stmp = stmp.split('"')[1].split('"')[0];
                    }
                    console.log(stmp);
                }
            });

            //选取带有 src 属性的 img 元素
            $("img[src]").each(function(i,d){
                let stmp = $(d).attr("src");
                console.log(stmp);
            });
            
            //console.log(data);
        }
        catch (e) {
            response.message = e.message;
            console.log(e.message);
        }


        return response;
    }
}


module.exports = crawler_html;
