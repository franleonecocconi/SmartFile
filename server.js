const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let users = [];

io.on("connection", (socket) => {

    console.log("Usuario conectado:", socket.id);

    users.push(socket.id);

    // Enviar lista completa al nuevo usuario
    socket.emit("all-users", users);

    // Avisar a los demás
    socket.broadcast.emit("new-user", socket.id);

    socket.on("disconnect", () => {

        console.log("Usuario desconectado:", socket.id);

        users = users.filter(id => id !== socket.id);

        io.emit("user-left", socket.id);

    });

});

server.listen(3000, "0.0.0.0", () => {
    console.log("SmartFile iniciado en puerto 3000");
});