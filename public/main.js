var app = new Vue({
    el: '#app',
    data: {
        ticketStatus: {},
        filteredTicketStatus: {},
        sports: {},
        places: {},
        dates: {},
        selectedPlace: '',
        selectedSport: '',
        selectedDate: ''
    },
    created: function () {
        var self = this;
        $.get('/api/ticketStatus').then(function (json) {
            self.ticketStatus = _.groupBy(json, 'sport');
            json.forEach(function (status) {
                self.sports[status.sport] = true;
                self.places[status.place] = true;
                self.dates[status.date] = true;
            })
        })
    },
    method: {
        filterData: function () {
            // this.
        }
    }
})