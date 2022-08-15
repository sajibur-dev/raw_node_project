
const fs = require('fs')
const path = require('path')

const basedir = path.join(__dirname,'../.data')

const lib = {}

lib.create = (dir,file,data,callback) => {
    fs.open(`${basedir}/${dir}/${file}.json`,'wx',(err,fileDiscriptor)=>{
        if (!err && fileDiscriptor) {
            const dbData = JSON.stringify(data);
            fs.writeFile(fileDiscriptor,dbData,(err)=>{
                if (!err) {
                    fs.close(fileDiscriptor,(err)=>{
                        if (!err) {
                            callback(false)
                        } else {
                            callback(`c-${err}`)
                        }
                    })
                } else {
                    callback(`w-${err}`)
                }
            })
        } else {
            callback(`o-${err}`)
        }
    })
}

lib.read = (dir,file,callback) => {
    fs.readFile(`${basedir}/${dir}/${file}.json`,'utf8',(err,data)=>{
        callback(err,data);
    })
}

lib.update = (dir,file,data,callback) => {
    fs.open(`${basedir}/${dir}/${file}.json`,'r+',(err,fileDiscriptor)=>{
        if(!err && fileDiscriptor){
            const updatedData = JSON.stringify(data)
            fs.ftruncate(fileDiscriptor,(err)=>{
                if(!err){
                    fs.writeFile(fileDiscriptor,updatedData,(err)=>{
                        if(!err){
                            fs.close(fileDiscriptor,(err)=>{
                                if(!err){
                                    callback(false)
                                } else {
                                    callback(err)
                                }
                            })
                        } else {
                            callback(err)
                        }
                    })
                } else {
                    callback(err)
                }
            })
        } else {
            callback(err)
        }
    })
};

lib.remove = (dir,file,callback) => {
    fs.unlink(`${basedir}/${dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false)
        } else {
            callback(err);
        }
    })
}
module.exports = lib;