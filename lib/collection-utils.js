function reduceToListByProperty(collection, propertyName) {
    return collection.reduce(function(accu, item, index) {
        accu.push(item[propertyName]);
        return accu;
    }, []).join(", ");
}

module.exports = {
    reduceToListByProperty: reduceToListByProperty
};