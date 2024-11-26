const express = require('express')
const app = express()
app.listen(3000)
app.use(express.json()) //POST에서 사용

let db = new Map()
let id = 1

app
    .route('/channels')
    //채널 생성
    .post((req, res)=>{
        if(req.body.channelTitle){
            db.set(id++, req.body)

            res.status(201).json({
                message : `${db.get(id-1).channelTitle}님, 채널을 응원합니다!`
            })
        } else {
            res.status(400).json({
                message : "채널명을 입력해주세요."
            })
        }
    })
    //채널 전체 조회
    .get((req, res)=>{
        if(db.size > 0){
            let channels = []
            db.forEach(function(value, key){
                channels.push(value)
    
            })

            res.status(200).json(channels)
        } else {
            res.status(404).json({
                message : "조회할 채널이 없습니다."
            })
        }
    })

app
    .route('/channels/:id')
    //채널 수정
    .put((req, res)=>{
        let {id} = req.params
        id = parseInt(id)
        let channel = db.get(id)
        let oldTitle = channel.channelTitle
        let newTitle = req.body.channelTitle

        if(channel && newTitle){
            channel.channelTitle = newTitle
            db.set(id, channel)
            res.status(200).json({
                message : `${oldTitle}님, 채널명이 ${newTitle}로 수정되었습니다.`
            })
        } else {
            res.status(404).json({
                message : "입력값을 다시 확인해주세요."
            })
        }
    })
    //채널 삭제
    .delete((req, res)=>{
        let {id} = req.params
        id = parseInt(id)
        
        if(db.get(id)){
            let channelTitle = db.get(id).channelTitle
            db.delete(id)
            res.status(200).json({
                message : `${channelTitle}님의 채널이 삭제되었습니다.`
            })
        } else {
            res.status(404).json({
                message : "채널 정보를 찾을 수 없습니다."
            })
        }
    })
    //채널 개별 조회
    .get((req, res)=>{
        let {id} = req.params
        id = parseInt(id)

        if(db.get(id)){
            res.status(200).json(db.get(id))
        } else {
            res.status(404).json({
                message : "채널 정보를 찾을 수 없습니다."
            })
        }
    })