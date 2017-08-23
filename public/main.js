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
        $.get('/api/ticketStatus').then(function (json) {
            self.allTicketStatus = json;
        })
    },
    methods: {
        getTicketStatus: function () {
            const self = this;
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
            $('#scheduleModal').modal({

            })
        }
    }
})