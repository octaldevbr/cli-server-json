import JSONServer from "@octaldev/json-server";

JSONServer.startServers({
    project: "Example Project",
    servers: {
        rest: 4500,
        file: 4750,
        socket: 5000,
    },
    database: {
        uri: "mongodb+srv://<user>:<password>@cluster0-dr81f.gcp.mongodb.net/<db>?retryWrites=true&w=majority",
        name: "example"
    }
});
