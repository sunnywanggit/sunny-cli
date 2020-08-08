#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const download = require('download-git-repo');

program
    .version(`0.1.0`);

/*
sunny init a a-name
基于 a 模板进行初始化，并为 a 模板起名 a-name
 */

const templates = {
    'sunny-a':{
        url:'git@github.com:sunnywanggit/sunny-a.git',
        downloadUrl:'sunnywanggit/sunny-a',
        description:'a 模板'
    },
    'sunny-b':{
        url:'git@github.com:sunnywanggit/sunny-b.git',
        downloadUrl:'git@github.com:sunnywanggit/sunny-b.git',
        description:'a 模板'
    }
}

program
    .command(`init <templateName> <projectName>`)
    .description("初始化项目模板")
    .action((templateName,projectName)=> {
        download(templates[templateName].downloadUrl, projectName, { clone: true }, function (err) {
            console.log(templates[templateName].downloadUrl)
            if(err){
                console.log(err)
            }else{
                console.log('success')
            }
        })
    })

program
    .command('list')
    .description('查看所有可用模板')
    .action(()=>{
        for(let key in templates){
            console.log(`${key} ${templates[key].description} `)
        }
    })

program.parse(process.argv);
