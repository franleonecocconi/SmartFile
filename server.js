const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(express.static(path.join(__dirname, "public")));

const devices = {};
const shares = {};

io.on("connection", (socket) => {

    console.log("Conectado:", socket.id);

    socket.on("register-device", (device) => {

        devices[socket.id] = {
            id: socket.id,
            ...device
        };

        io.emit("devices", Object.values(devices));
    });

    socket.on("create-share", () => {

        const shareId = uuidv4();

        shares[shareId] = {
            owner: socket.id
        };

        socket.emit("share-created", {
            shareId,
            url: `/download.html?id=${shareId}`
        });

    });

    socket.on("signal", (data) => {

        io.to(data.target).emit("signal", {
            from: socket.id,
            signal: data.signal
        });

    });

    socket.on("disconnect", () => {

        delete devices[socket.id];

        io.emit("devices", Object.values(devices));

        console.log("Desconectado:", socket.id);
    });

});

app.get("/api/devices", (req, res) => {
    res.json(Object.values(devices));
});

server.listen(process.env.PORT || 3000, () => {
    console.log("Servidor iniciado");
});