var _ = require("lodash");

function roll(sides, rolls, take, repeat) {
    var finalStats = [];
    _.times(repeat, function() {
        var diceSet = [];
        _.times(rolls, function() {
            diceSet.push(Math.floor(Math.random() * sides) + 1);
        });
        finalStats.push(_.sum(diceSet.sort().slice(diceSet.length - take, diceSet.length)));
    });
    return finalStats;
};

module.exports = {
    roll: roll
};