const express = require('express')
const app = express()
app.listen(3000)
app.use(express.json()) //POST에서 사용

let db = new Map()
let id = 1

//로그인
app.post('/login', (req, res)=>{
    const {userId, pwd} = req.body
    let idFound = false

    db.forEach(function(user){
        if(user.userId === userId){
            idFound = true
            if(user.pwd === pwd){
                res.status(200).json({
                    message : "로그인에 성공했습니다."
                })
                return
            } else {
                res.status(400).json({
                    message : "패스워드를 다시 확인해주세요."
                })
                return
            }
        }
    })

    if(!idFound){
        res.status(400).json({
            message : "아이디를 다시 확인해주세요."
        })
    }
})

//회원가입
app.post('/signup', (req, res)=>{
    if(req.body.userId && req.body.pwd && req.body.name){
        db.set(id++, req.body)
        res.status(201).json({
            message : `${db.get(id-1).name}님, 환영합니다!`
        })
    }else{
        res.status(400).json({
            message : "입력값을 다시 확인해주세요."
        })
    }
})

//router 사용- 회원 개별 조회, 탈퇴
app
    .route('/users/:id')
    .get((req, res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if(user == undefined){
            res.status(404).json({
                message : "회원 정보가 없습니다."
            })
        }else{
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        }
    })
    .delete((req, res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if(user == undefined){
            res.status(404).json({
                message : "회원 정보가 없습니다."
            })
        }else{
            db.delete(id)
            res.status(200).json({
                message : `${user.name}님, 다음에 또 뵙겠습니다.`
            })
        }
    })