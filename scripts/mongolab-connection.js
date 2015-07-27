// Because we are going to be using a remote connection, be sure
// to start the MongoDB Shell (mongo) with the --nodb flag. Then,
// we can connect and define our own db instance.

// Connect to the MongoLab database.
var connection = new Mongo("ds027483.mongolab.com:27483");

// Connect to the test database.
var db = connection.getDB("cally-bot");

// Authorize this connection.
db.auth("cally", "cally"); // USERNAME, PASSWORD

print("> MongoLab connection and DB defined.");


module.exports = {
    db: db
};
