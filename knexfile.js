module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: "/home/ownix/Cloud9/mervin/DEV-tennu-micro-mud.sqlite"
        },
        useNullAsDefault: true
    },
    production: {
        client: 'sqlite3',
        connection: {
            filename: "/home/ownix/Cloud9/mervin/tennu-micro-mud.sqlite"
        },
        useNullAsDefault: true
    }
};