function list(hostname) {
    var self = this;
    return new self._databaseCtx.models.Class().fetchAll();
}

module.exports = function(databaseCtx) {
    return {
        _databaseCtx: databaseCtx,
        list: list,
    };
}