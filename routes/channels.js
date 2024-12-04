const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const {body, param, validationResult} = require('express-validator')

router.use(express.json())

const validate = (req, res, next) => {
    const err = validationResult(req)
    if(err.isEmpty()){
        return next()
    } else {
        return res.status(400).json(err.array())
    }
}

router
    .route('/')
    //채널 생성
    .post(
        [
            body('userId').notEmpty().isInt().withMessage('validation error-userId'),
            body('name').notEmpty().isString().withMessage('validation error-name'),
            validate
        ]
        ,(req, res)=>{

        const {name, userId} = req.body

        conn.connect(function (err) {
            if (err) throw err

            let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`
            let values = [name, userId]
            conn.query(sql, values, function (err, results) {
                if (err) throw err

                res.status(201).json({
                    message: `${name}님, 채널을 응원합니다!`
                })
            })
        })
    })
    //채널 전체 조회
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('validation error-userId'),
            validate
        ]
        ,(req, res)=>{

        let {userId} = req.body

        conn.connect(function (err) {
            if (err) throw err

            let sql = `SELECT * FROM channels WHERE user_id = ?`
            conn.query(sql, userId, function (err, results) {
                if (err) throw err
                if(results.length){
                    res.status(200).json(results)
                } else {
                    res.status(404).json({
                        message : "채널 정보를 찾을 수 없습니다."
                    })
                }
            })
        })
    })

router
    .route('/:id')
    //채널 수정
    .put(
        [
            param('id').notEmpty().withMessage('validation error-id'),
            body('name').notEmpty().isString().withMessage('validation error-name'),
            validate
        ]
        ,(req, res)=>{

        let {id} = req.params
        id = parseInt(id)
        let {name} = req.body

        conn.connect(function (err) {
            if (err) throw err

            let sql = `UPDATE channels SET name = ? WHERE id = ?`
            let values = [name, id]
            conn.query(sql, values, function (err, results) {
                if (err) throw err
                if(results.affectedRows != 0){
                    res.status(200).json(results)
                } else {
                    res.status(404).json({
                        message : "채널 정보를 찾을 수 없습니다."
                    })
                }
            })
        })
    })
    //채널 삭제
    .delete(
        [
            param('id').notEmpty().withMessage('validation error-id'),
            validate
        ]
        ,(req, res)=>{

        let {id} = req.params
        id = parseInt(id)

        conn.connect(function (err) {
            if (err) throw err

            let sql = `DELETE FROM channels WHERE id = ?`
            conn.query(sql, id, function (err, results) {
                if (err) throw err
                if(results.affectedRows != 0){
                    res.status(200).json(results)
                } else {
                    res.status(404).json({
                        message : "채널 정보를 찾을 수 없습니다."
                    })
                }
            })
        })
    })
    //채널 개별 조회
    .get(
        [
            param('id').notEmpty().withMessage('validation error-id'),
            validate
        ]
        ,(req, res)=>{
        
        let {id} = req.params
        id = parseInt(id)

        conn.connect(function (err) {
            if (err) throw err

            let sql = `SELECT * FROM channels WHERE id = ?`
            conn.query(sql, id, function (err, results) {
                if (err) throw err
                if(results.length){
                    res.status(200).json(results)
                } else {
                    res.status(404).json({
                        message : "채널 정보를 찾을 수 없습니다."
                    })
                }
            })
        })
    })

module.exports = router