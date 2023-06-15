const busboy = require('busboy')

function busBoyBodyParser(req,res,next){
    let result ={
        files:[],
        field:{}
    }
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {

        const collectData = {
            info:{
                ...info,
                size:0
            },
            data:[]
        }
        file.on('data', (data) => {
            collectData.data.push(data)
            collectData.info.size += data.length
        }).on('close', () => {
            collectData.data = Buffer.concat(collectData.data)
            result.files.push(collectData)
        });
    });
    bb.on('field', (name, val, info) => {
        result.field[name]=val
    });
    bb.on('close', () => {
        req.body = result
        next()
    });
    req.pipe(bb)
}

module.exports = busBoyBodyParser