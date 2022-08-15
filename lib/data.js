
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

module.exports = lib;