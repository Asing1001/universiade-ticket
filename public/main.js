var app = new Vue({
    el: '#app',
    data: {
        allTicketStatus: [],
        hideSellOut: false,
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
            return this.hideSellOut ? _.chain(allData).filter('hasTicket').groupBy('sport').value() : _.groupBy(allData, 'sport');
        }
    }
})