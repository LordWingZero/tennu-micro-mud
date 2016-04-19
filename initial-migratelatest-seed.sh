rm -f "/home/ownix/Cloud9/mervin/DEV-tennu-micro-mud.sqlite"
knex migrate:latest
knex seed:run