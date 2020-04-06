
const http = require('http');
const https = require('https');
const superagent = require("superagent");

const request = require('request');
const cheerio = require('cheerio');

var join = require('path').join;
var Util = require(join(__dirname, '../Systemlib', 'Util.js'));
var util = new Util();
const LinkConfig = util.getConfig();

function callback(error, response, data) {
    if (!error && response.statusCode == 200) {

        try {
            var $ = cheerio.load(data);

            console.log($("head title").text());


            $("head meta").each(function (i, d) {
                var stmp = $(d).attr("name");
                if (stmp == "keywords" || stmp == "description") {
                    console.log($(d).attr("content"))
                }
            });



            //console.log(data);
        }
        catch (e) {
            console.log(e.message);
        }
    }
}

function crawler_init() {
    this.routing = "PD.JS.crawler";

    this.execute = function (para) {
        var response = { "Status": 200, "Message": "" };

        var isequelize = require(join(__dirname, '../Systemlib', 'sequelize.js'));
        var cmd = new isequelize(LinkConfig.DBconnect);

        var headers = {
            'User-Agent': 'Mozilla/5.0 Gecko/20100101 Firefox/70.0',
            'Connection': 'keep-alive',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
            'Upgrade-Insecure-Requests': '1',
            "Remark": ""
        };

        var url = 'https://www.bilibili.com';
        url = 'https://www.baidu.com';

        //url = 'https://search.bilibili.com/all?keyword=%E6%B1%BD%E8%BD%A6&from_source=nav_suggest_new';
        //url = 'http://cloud_c2.gitee.io/blog/';

        var options = {
            url: url,
            headers: headers
        };

        var arrp = [];

        var mod = cmd.dbo["t_crad_urlmst"];

        let mst = null;

        arrp.push(
            (async () => {
                mst = await mod.findOne({ where: { url: options.url } });
                if (mst == null) {
                    await mod.create({
                        url: options.url
                    });
                    mst = await mod.findOne({ where: { url: options.url } });
                }
            })()
        );

        var html = "";
        var url_robots = join(options.url, "robots.txt");
        arrp.push(
            (async () => {
                https.get(url_robots, function (res) {
                    var arr = [], size = 0;
                    res.on('data', function (data) {
                        arr.push(data);
                        size += data.length;
                    });
                    res.on('end', function () {
                        var data = Buffer.concat(arr, size);
                        html = data.toString();
                        //console.log(html);
                    });
                });
            })()
        );


        Promise.all(arrp).then(() => {
            arrp.length = 0;
            let item = null;
            (async () => {
                mod = cmd.dbo["t_crad_urlitem"];
                //console.log(JSON.stringify(mst,null,4));
                item = await mod.findOne({ where: { id: mst.id, url: url_robots } });
                if (item == null) {
                    item = {
                        id: mst.id
                        , guid: util.GUID()
                        , url: url_robots
                        , remark: html
                    };
                    mod.create(item);
                }
            })()
        });


        

        response.Message = para.CommandCode + " rep " + para.Msg + " ";

        return response;
    };
}


module.exports = crawler_init;

