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
            const allData = this.allTicketStatus;
            return _.chain(allData)
                .filter(data => !this.selectedSport || data.sport === this.selectedSport)
                .filter(data => !this.hideSellOut || data.hasTicket)
                .groupBy('sport')
                .value();
        },
        getSportType: function () {
            return [''].concat(_.uniq(this.allTicketStatus.map(ticket => ticket.sport)));
        },
        showSchedule: function (ticket) {
            this.selectedTicket = ticket;
            $('#scheduleModal').modal({

            })
        }
    }
})