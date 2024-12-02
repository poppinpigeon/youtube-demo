const express = require('express')
const router = express.Router()
const conn = require('../mariadb')

router.use(express.json())

router.post('/login', (req, res) => {
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

router.post('/signup', (req, res) => {
    let user = req.body //email, name, pwd, contact

    if (user.email && user.name && user.pwd) {
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
    } else {
        res.status(400).json({
            message: "입력값을 다시 확인해주세요."
        })
    }
})

//router 사용- 회원 개별 조회, 탈퇴
router
    .route('/users')
    .get((req, res) => {
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
    .delete((req, res) => {
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