const { getCheerio$ } = require('./util');
const fetch = require("isomorphic-fetch");

const rootUrl = 'https://tickets.2017.taipei'
const distFolder = 'dist/';
const getAllTicketStatus = async () => {
    let allStatus = [];
    for (var i = 1; i <= 22; i++) {
        const sportId = ('0' + i).slice(-2);
        const ticketStatus = await getTicketStatus(sportId);
        const sportName = ticketStatus.length > 0 ? ticketStatus[0].sport : sportId;
        console.log(`Get ticket status for ${sportName}`);
        allStatus = allStatus.concat(ticketStatus)
    }
    return allStatus;
}

const getTicketStatus = (sportsId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const $ = await getCheerio$(`${rootUrl}/schedule/17_TPE_${sportsId}`)
            const promises = Array.from($('#schedule-info tr:has(button)').map(async (index, tr) => {
                const $tr = $(tr);
                const $tds = $tr.find('td')
                const ticketUrl = rootUrl + $tr.find('button').attr('onclick').split('\'')[1];
                const ticketResponse = await fetch(ticketUrl)
                const ticketStatus = await ticketResponse.text();
                return {
                    date: $tds.eq(0).text(),
                    sport: $tds.eq(1).text(),
                    place: $tds.eq(2).text(),
                    hasTicket: ticketStatus.indexOf('本活動已售完') === -1,
                    url: ticketUrl
                }
            }));
            const results = await Promise.all(promises);
            resolve(results);
        }
        catch (err) {
            console.error(err)
        }
    })
}

module.exports = { getAllTicketStatus }
