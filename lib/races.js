function list(hostname) {
    var self = this;
    return new self._databaseCtx.models.Race().fetchAll();
}

module.exports = function(databaseCtx) {
    return {
        _databaseCtx: databaseCtx,
        list: list,
    };
}