var plugin = require("../plugin.js");
var should = require("should")

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

describe('tennu-micro-mud', function() {

    var handlers = plugin.init(client).handlers;

    describe('player', function() {

        it('Should allow creating a player.', function(done) {
            
            var IRCMessage = {
                hostmask: testUser.hostmask,
                message: "!createchar --name=Test --race=Human --class=Wizard"  
            };
            
            var desiredResponse = {
                
            };
            
            handlers["!createchar"](IRCMessage)
            .then(function(response){
                response.should.be.equal(desiredResponse);
                done();
            });
            
        });
    });


});