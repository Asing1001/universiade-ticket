const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const { getAllTicketStatus, mergeTicketStatus } = require('./ticket');
const app = express()
const redis = require('redis');

const ticketStatusKey = 'ticketstatus';
const scheduleKey = 'schedule';
const redisClient = redis.createClient(process.env.REDIS_URL).on("error", err => console.log("Error " + err));

app.get('/api/ticketstatus', (req, res, next) => {
    redisClient.get(ticketStatusKey, async (err, strTicketStatus) => {
        let ticketStatus;
        if (!strTicketStatus) {
            ticketStatus = await getAllTicketStatusWithSchedule();
            redisClient.set(ticketStatusKey, JSON.stringify(ticketStatus))
        } else {
            ticketStatus = JSON.parse(strTicketStatus);
        }
        res.json(ticketStatus)
    })
})

const getAllTicketStatusWithSchedule = async () => {
    return new Promise(async (resolve) => {
        let ticketStatus = await getAllTicketStatus();
        if (ticketStatus.length > 0) {
            redisClient.get(scheduleKey, async (err, strSchedule) => {
                const schedules = JSON.parse(strSchedule) || [];
                ticketStatus = ticketStatus.map(t => {
                    t.schedules = schedules
                        .filter(({ date, sport, place }) => t.date === date && t.sport === sport && t.place === place)
                        .map(({ item, gender, stage, time }) => ({ item, gender, stage, time }));
                    return t;
                })
                resolve(ticketStatus)
            })
        } else {
            resolve(ticketStatus)
        }
    })
}

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
    const newTicketStatus = await getAllTicketStatusWithSchedule();
    redisClient.get(ticketStatusKey, async (err, strTicketStatus) => {
        const oldTicketStatus = JSON.parse(strTicketStatus);
        let ticketStatus;
        if (oldTicketStatus) {
            ticketStatus = mergeTicketStatus(oldTicketStatus, newTicketStatus);
        } else {
            ticketStatus = newTicketStatus;
        }
        redisClient.set(ticketStatusKey, JSON.stringify(ticketStatus))
        console.timeEnd('[Scheduler] getAllTicketStatus');
    })
}, 300000)