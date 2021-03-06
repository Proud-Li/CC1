var Service = require('node-windows').Service;
var join = require('path').join;

var svc = new Service({
    name: 'LinkHome',    //服务名称
    description: 'LinkHome (node service)', //描述
    script: join(__dirname,'/server.js') //nodejs项目要启动的文件路径
});

svc.on('uninstall',function(){
    console.log('Uninstall complete.');
    console.log('The service exists: ',svc.exists);
});

svc.uninstall();