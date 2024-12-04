const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const {body, validationResult} = require('express-validator')

router.use(express.json())

const validate = (req, res, next) => {
    const err = validationResult(req)
    if(err.isEmpty()){
        return next()
    } else {
        return res.status(400).json(err.array())
    }
}
//로그인
router.post('/login', 
    [
        body('email').notEmpty().isEmail().withMessage('validation error-email'),
        body('pwd').notEmpty().isString().withMessage('validation error-pwd'),
        validate
    ],
    (req, res) => {
    const { email, pwd } = req.body

    conn.connect(function (err) {
        if (err) throw err

        let sql = `SELECT * FROM users WHERE email = ?`
        conn.query(sql, email, function (err, results) {
            if (err) throw err

            let loginUser = results[0]

            if (loginUser && loginUser.pwd == pwd) {
                res.status(200).json({
                    message: `${loginUser.name}님, 로그인에 성공했습니다.`
                })
            } else {
                res.status(404).json({
                    message: '이메일 또는 비밀번호를 다시 입력해주세요.'
                })
            }
        })
    })
})
//회원 가입
router.post('/signup', 
    [
        body('email').notEmpty().isEmail().withMessage('validation error-email'),
        body('name').notEmpty().isString().withMessage('validation error-name'),
        body('pwd').notEmpty().isString().withMessage('validation error-pwd'),
        body('contact').notEmpty().isString().withMessage('validation error-contact'),
        validate
    ],
    (req, res) => {
    const { email, name, pwd, contact } = req.body

    conn.connect(function (err) {
        if (err) throw err

        let sql = `INSERT INTO users (email, name, pwd, contact) VALUES (?, ?, ?, ?)`
        let values = [email, name, pwd, contact]
        conn.query(sql, values, function (err, results) {
            if (err) throw err

            res.status(201).json({
                message: `${name}님, 유튜브에 오신 것을 환영합니다!`
            })
        })
    })
})

router
    .route('/users')
    //회원 개별 조회
    .get(
        [
            body('email').notEmpty().isEmail().withMessage('validation error-email'),
            validate
        ],
        (req, res) => {
        let { email } = req.body

        conn.connect(function (err) {
            if (err) throw err

            let sql = `SELECT * FROM users WHERE email = ?`
            conn.query(sql, email, function (err, results) {
                if (err) throw err

                if (results.length) {
                    res.status(200).json(results)
                } else {
                    res.status(404).json({
                        message: "회원 정보가 없습니다."
                    })
                }
            })
        })
    })
    //회원 개별 탈퇴
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage('validation error-email'),
            validate
        ],
        (req, res) => {
        let { email } = req.body

        conn.connect(function (err) {
            if (err) throw err

            let sql = `DELETE FROM users WHERE email = ?`
            conn.query(sql, email, function (err, results) {
                if (err) throw err
                res.status(200).json({
                    message: `${email}회원님, 다음에 또 뵙겠습니다.`
                })
            })
        })
    })

module.exports = router