var plugin = require("../plugin.js");
var should = require("should")
var Promise = require('bluebird');

var config = {
    "micro-mud": {

    }
};

var client = {
    _logger: {
        debug: function(message) {
            console.log(message);
        }
    },
    config: function(key) {
        return config[key];
    }
};

var testUser = {
    nickname: "testuser",
    hostmask: {
        hostname: "user.test.gamesurge",
    }
};

should.Assertion.add('successResponse', function() {
    this.params = {
        operator: 'to be successNotice'
    }

    this.obj.should.have.property('intent').which.is.a.String();
    this.obj.should.have.property('query').which.is.a.Boolean();
    this.obj.should.have.property('message');
});

describe('tennu-micro-mud', function() {

    var knexfile = require("../knexfile");
    var knex = require('knex')(knexfile[process.env.NODE_ENV]);
    var handlers = plugin.init(client).handlers;

    before(function(done) {
        return Promise.join(
                knex('players').del()
            )
            .then(function() {
                done();
            });
    });

    describe('commands', function() {

        it('Should allow creating a player.', function(done) {

            var IRCMessage = {
                hostmask: testUser.hostmask,
                message: "!createchar --name=Test --race=Human --class=Wizard"
            };

            handlers["!createchar"](IRCMessage)
                .then(function(response) {
                    response.should.be.successResponse();
                    done();
                });
        });

        it('Should allow listing stats.', function(done) {

            var IRCMessage = {
                hostmask: testUser.hostmask,
                message: "!charstats --name=Test"
            };

            handlers["!charstats"](IRCMessage)
                .then(function(response) {
                    response.should.be.successResponse();
                    done();
                });
        });

        it('Should allow listing stats for current hostname.', function(done) {

            var IRCMessage = {
                hostmask: testUser.hostmask,
                message: "!charstats"
            };

            handlers["!charstats"](IRCMessage)
                .then(function(response) {
                    response.should.be.successResponse();
                    done();
                });
        });

        it('Should allow listing players.', function(done) {

            var IRCMessage = {
                hostmask: testUser.hostmask,
                message: "!chars"
            };

            handlers["!chars"](IRCMessage)
                .then(function(response) {
                    response.should.be.successResponse();
                    done();
                });
        });

        it('Should allow listing classes.', function(done) {

            var IRCMessage = {
                hostmask: testUser.hostmask,
                message: "!classes"
            };

            handlers["!classes"](IRCMessage)
                .then(function(response) {
                    response.should.be.successResponse();
                    done();
                });
        });

        it('Should allow listing races.', function(done) {

            var IRCMessage = {
                hostmask: testUser.hostmask,
                message: "!races"
            };

            handlers["!races"](IRCMessage)
                .then(function(response) {
                    response.should.be.successResponse();
                    done();
                });
        });

        // it('Should allow listing stats.', function(done) {

        //     var IRCMessage = {
        //         hostmask: testUser.hostmask,
        //         message: "!charstatsest --name=Test" //TODO without name
        //     };

        //     handlers["!createchar"](IRCMessage)
        //         .then(function(response) {
        //             response.should.be.successSay();
        //             done();
        //         });

        // });

    });


});