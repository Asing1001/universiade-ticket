var app = new Vue({
    el: '#app',
    data: {
        allTicketStatus: [],
        hideSellOut: false,
        selectedTicket: { schedules: [] },
        selectedSport: ''
    },
    created: function () {
        var self = this;
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var twDate = new Date(utc + (3600000 * 8));
        $.get('/api/ticketStatus').then(function (allTicketStatus) {
            self.allTicketStatus = allTicketStatus.filter(function (data) {
                var isIncomingEvent = data.date.slice(8, 10) >= twDate.getDate()
                return isIncomingEvent;
            });
        })
    },
    methods: {
        getTicketStatus: function () {
            var self = this;
            return _.chain(self.allTicketStatus)
                .filter(function (data) {
                    return !self.selectedSport || data.sport === self.selectedSport
                })
                .filter(function (data) {
                    return !self.hideSellOut || data.hasTicket
                })
                .groupBy('sport')
                .value();
        },
        getSportType: function () {
            return [''].concat(
                _.uniq(this.allTicketStatus.map(function (ticket) {
                    return ticket.sport;
                }))
            );
        },
        showSchedule: function (ticket) {
            this.selectedTicket = ticket;
            $('#scheduleModal').modal({})
        }
    }
})