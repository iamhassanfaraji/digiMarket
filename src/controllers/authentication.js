const userModel = require('../models/user')

const jwt=require('jsonwebtoken')

function cookieToObj(str){
    const stepFirst = str.split(';')
    const stepSecond ={}
    stepFirst.forEach((elem)=>{
        const d_space = elem.trim()
        let stepFirst =d_space.split('=')
        stepSecond[stepFirst[0]]=stepFirst[1]
    })
    return stepSecond
}




async function authentication(req,res,next){
    if(req.url == "/login"){
        next()
    }else{
        try{
            let TOKEN = ''
            if(req.headers["cookie"]){
                const usableCookie = cookieToObj(req.headers["cookie"])
                TOKEN = usableCookie.token
            }else if(req.headers.token){
                TOKEN = req.headers.token
            }else{
                throw(401)
            }
            
            const decoded =jwt.verify(TOKEN,process.env.secretKeyAdmin)
            const user = await userModel.findById(`${decoded.id}`)
            if(user){
                if(user.loginSession==true){
                    next()
                }else{
                    throw(401)
                }
            }else{
                throw(401)
            } 
        }catch(err){
            res.status(401).send('invalid token')
        }
    }
}

module.exports = authentication