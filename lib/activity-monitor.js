function add(hostname) {
    var exists = this.chatters.filter(function(chatter) {
        return chatter.hostname === hostname;
    });
    if (exists.length === 0) {
        this.chatters.push({
            hostname: hostname,
            activeOn: new Date()
        });
    }
}

function clear(hostname) {
    this.chatters = [];
}

module.exports = {
    chatters: [],
    add: add,
    clear: clear
};