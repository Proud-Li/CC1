var Sequelize = require('sequelize');

var join = require('path').join;
var Util = require(join(__dirname, '../Systemlib', 'Util.js'));
var util = new Util();


function dboImport(cmd) {
    var path = join(__dirname, '../models');
    util.getJsFiles(path).forEach(function (item) {
        var fPath = join(path, item);
        module.exports[util.FileNameSuffix(item)] = require(fPath)(cmd, Sequelize);
    });
}

function sequelize(DBconnect) {

    /*
    // 数据库配置文件
    var sqlConfig = {
        "host": "192.168.0.102",
        "port": "3306",
        "user": "sa",
        "password": "",
        "database": ""
    };
    sqlConfig = DBconnect;

    sqlConfig.dialect = "mysql";
    sqlConfig.pool = { max: 10, min: 0, idle: 10000 };
 

    var xtmp = new Sequelize(sqlConfig.database, sqlConfig.user, sqlConfig.password, sqlConfig);

    */

    var xtmp = new Sequelize(DBconnect, {  
        // Look to the next section for possible options
        pool : { max: 10, min: 0, idle: 10000 }
    })
    
    dboImport(xtmp);

    this.cmd = xtmp;
    this.dbo = module.exports;
    this.ori = Sequelize;


}



module.exports = sequelize;