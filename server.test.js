const test = require('ava');
const {mergeTicketStatus} = require('./server');

test('mergeTicketStatus should keep old length', t => {
    const expect = 2;
    const oldTicketStatus = [{},{}];
    const newTicketStatus = [{}];
    t.deepEqual(expect, mergeTicketStatus(oldTicketStatus, newTicketStatus).length);
})

test('mergeTicketStatus should use newStatus first', t => {
    const oldTicketStatus = [{ "date": "2017/08/25(六)", "sport": "田徑", "place": "臺北田徑場", "hasTicket": true }];
    const newTicketStatus = [{ "date": "2017/08/25(六)", "sport": "田徑", "place": "臺北田徑場", "hasTicket": false }];
    t.false(mergeTicketStatus(oldTicketStatus, newTicketStatus)[0].hasTicket);
})

test('mergeTicketStatus if no match for oldTicket, hasTicket should be false', t => {
    const oldTicketStatus = [{ "date": "2017/08/25(五)", "sport": "田徑", "place": "臺北田徑場", "hasTicket": true }];
    const newTicketStatus = [];
    t.false(mergeTicketStatus(oldTicketStatus, newTicketStatus)[0].hasTicket);
})

