const express = require('express')
const router = express.Router() //router.js의 라우터 연결
router.use(express.json()) //POST에서 사용

let db = new Map()
let id = 1

//로그인
router.post('/login', (req, res)=>{
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
        res.status(404).json({
            message : "아이디를 다시 확인해주세요."
        })
    }
})

//회원가입
router.post('/signup', (req, res)=>{
    let user = req.body
    if(user.userId && user.pwd && user.name){
        db.set(user.userId, user)
        res.status(201).json({
            message : `${db.get(user.userId).name}님, 환영합니다!`
        })
    }else{
        res.status(400).json({
            message : "입력값을 다시 확인해주세요."
        })
    }
})

//router 사용- 회원 개별 조회, 탈퇴
router
    .route('/users')
    .get((req, res)=>{
        let {userId} = req.body
        const user = db.get(userId)

        if(user){
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        }else{
            res.status(404).json({
                message : "회원 정보가 없습니다."
            })
        }
    })
    .delete((req, res)=>{
        let {userId} = req.body
        const user = db.get(userId)

        if(user){
            db.delete(userId)
            res.status(200).json({
                message : `${user.name}님, 다음에 또 뵙겠습니다.`
            })
        }else{
            res.status(404).json({
                message : "회원 정보가 없습니다."
            })
        }
    })

module.exports = router