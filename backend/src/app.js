const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());


// Setting morgan for logs
app.use(
    morgan(function (tokens, req, res) {
        if (tokens.method(req, res) !== "POST") {
            return [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, "content-length"),
                "-",
                tokens["response-time"](req, res),
                "ms",
            ].join(" ");
        }
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"),
            "-",
            tokens["response-time"](req, res),
            "ms",
            tokens.content(req, res),
        ].join(" ");
    })
);
morgan.token("content", function (request, _response) {
    return JSON.stringify(request.body);
});



//Endpoints

app.get("/", (_request, response) => {response.send("<h1>Conduit api in progress!</h1>");});

app.post("/api/users/login", (request, response) => {});

app.post("/api/users", (request, response) => {});

app.get("/api/user", (request, response) => {});

app.put("/api/user", (request, response) => {});

app.get("/api/profiles/:username", (request, response) => {});

app.post("/api/profiles/:username/follow", (request, response) => {});

app.delete("/api/profiles/:username/follow", (request, response) => {});

app.get("/api/articles", (request, response) => {});

app.get("/api/articles/feed", (request, response) => {});

app.get("/api/articles/:slug", (request, response) => {});

app.post("/api/articles", (request, response) => {});

app.put("/api/articles/:slug", (request, response) => {});

app.delete("/api/articles/:slug", (request, response) => {});

app.post("/api/articles/:slug/comments", (request, response) => {});

app.get("/api/articles/:slug/comments", (request, response) => {});

app.delete("/api/articles/:slug/comments/:id", (request, response) => {});

app.post("/api/articles/:slug/favorite", (request, response) => {});

app.delete("/api/articles/:slug/favorite", (request, response) => {});

app.get("/api/tags", (request, response) => {});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT} `);
