#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const download = require('download-git-repo');
const inquirer = require('inquirer')
const fs = require('fs')
const handlebars = require('handlebars')
const ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')

//github 公用项目模板
const templates = {
    'sunny-a':{
        url:'git@github.com:sunnywanggit/sunny-a.git',
        downloadUrl:'sunnywanggit/sunny-a',
        description:'a 模板'
    },
    'sunny-b':{
        url:'git@github.com:sunnywanggit/sunny-b.git',
        downloadUrl:'sunnywanggit/sunny-b.git',
        description:'b 模板'
    }
}

program
    .version(`0.1.0`)

/*
sunny init a a-name
基于 a 模板进行初始化，并为 a 模板起名 a-name
 */
program
    .command(`init <templateName> <projectName>`)
    .description("初始化项目模板")
    .action((templateName,projectName)=> {
        //下载之前使用 ora 做 loading 提示
        const spinner = ora('模板正在下载中...').start()
        //第一个参数：下载地址  第二个参数：下载路径
        download(templates[templateName].downloadUrl, projectName, { clone: true }, function (err) {
            console.log(templates[templateName].downloadUrl)
            //下载失败提示
            if(err){
                spinner.fail();
                console.log(logSymbols.error,chalk.red(err))
                return
            }
            //下载成功提示
            spinner.succeed()

            //读取模板中的 package.json 文件，并使用向导的方式询问用户各个字段的取值
            //然后使用模板引擎把用户输入的数据解析到 package.json 文件中
            //最后把解析之后的结果重新写入 package.json 文件中
            inquirer.prompt([
                { type:'input', name:'name', message:'请输入项目名称' },
                { type:'input', name:'description', message:'请输入项目描述' },
                { type:'input', name:'author', message:'请输入作者' }
            ]).then((anwser)=>{
                //把采集到的用户输入的数据，替换到 package.json 文件中
                const packagePath = `${projectName}/package.json`
                const packageContent = fs.readFileSync(packagePath,'utf-8')
                const packageResult = handlebars.compile(packageContent)(anwser)
                fs.writeFileSync(packagePath,packageResult)
                console.log(logSymbols.success,chalk.blue('初始化项目模板成功'))
            })
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
