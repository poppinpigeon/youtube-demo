const express = require('express')
const app = express()
app.listen(3000)

//user-demo 소환
const userRouter = require('./routes/users')

//channel-demo 소환
const channelRouter = require('./routes/channels')

app.use("/", userRouter)
app.use("/channels", channelRouter)
