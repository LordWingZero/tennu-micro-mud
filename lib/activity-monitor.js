
var add = function(hostname){
    this.hostnamePool[hostname] = null;
}

var clear = function(){
    this.hostnamePool = {};
}

module.exports = {
    hostnamePool: [],
    add: add,
    clear: clear
};