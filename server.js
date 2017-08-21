const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const {getAllTicketStatus } = require('./ticket');
const app = express()
const redis = require('redis');

const redisKey = 'ticketstatus';
const redisClient = redis.createClient(process.env.REDIS_URL).on("error", err => console.log("Error " + err));

app.get('/api/ticketstatus', (req, res, next) => {
    redisClient.get(redisKey, async (err, strTicketStatus) => {
        let ticketStatus;
        if (!strTicketStatus) {
            ticketStatus = await getAllTicketStatus();
            redisClient.set(redisKey, JSON.stringify(ticketStatus))
        }else {
            ticketStatus = JSON.parse(strTicketStatus);
        }
        res.json(ticketStatus)
    })
})

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something went wrong ! Error: " + err.message);
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('app running on port', port);
})

setInterval(async () => {
    console.time('[Scheduler] getAllTicketStatus');
    let newStatus = await getAllTicketStatus();
    if (newStatus.length > 0) {
        redisClient.set(redisKey, JSON.stringify(newStatus))
    }
    console.timeEnd('[Scheduler] getAllTicketStatus');
}, 3600000)