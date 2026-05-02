const socket = io();

const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");

if (!uploadBox || !fileInput) return;

/*
========================
DEVICE DETECTOR
========================
*/

function getDeviceType() {

    const ua = navigator.userAgent;

    if (!ua) {
        return { name: "Dispositivo", icon: "💻" };
    }

    if (ua.includes("iPhone")) {
        return { name: "iPhone", icon: "📱" };
    }

    if (ua.includes("iPad")) {
        return { name: "iPad", icon: "📲" };
    }

    if (ua.includes("Mac")) {
        return { name: "Mac", icon: "💻" };
    }

    if (ua.includes("Android")) {

        if (ua.includes("Mobile")) {
            return { name: "Teléfono Android", icon: "📱" };
        }

        return { name: "Tablet Android", icon: "📲" };
    }

    if (ua.includes("Windows")) {
        return { name: "PC Windows", icon: "🖥️" };
    }

    if (ua.includes("Linux")) {
        return { name: "PC Linux", icon: "🐧" };
    }

    return { name: "Dispositivo", icon: "💻" };
}

/*
========================
SOCKET CONNECT
========================
*/

socket.on("connect", () => {

    const device = getDeviceType();

    socket.emit("device-join", {
        id: socket.id,
        name: device.name,
        icon: device.icon
    });
});

/*
========================
CLICK
========================
*/

uploadBox.addEventListener("click", () => {
    fileInput.click();
});

/*
========================
DRAG OVER
========================
*/

uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
});

/*
========================
DROP
========================
*/

uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});

/*
========================
INPUT FILES
========================
*/

fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
});

/*
========================
HANDLE FILES
========================
*/

function handleFiles(files) {

    if (!files || files.length === 0) return;

    const list = [];

    for (const f of files) {
        list.push({
            name: f.name,
            size: f.size,
            type: f.type
        });
    }

    sessionStorage.setItem("smartfile_files", JSON.stringify(list));

    const device = getDeviceType();

    socket.emit("files-selected", {
        files: list,
        device: device
    });

    window.location.href = "upload.html";
}

/*
========================
DISPOSITIVOS UPDATE
========================
*/

socket.on("devices-update", (devices) => {

    const box = document.getElementById("devicesBox");
    if (!box) return;

    box.innerHTML = "";

    devices.forEach(d => {

        const div = document.createElement("div");

        div.style.padding = "8px";
        div.style.borderBottom = "1px solid #eee";

        div.innerText = `${d.icon || "💻"} ${d.name || "Dispositivo"}`;

        box.appendChild(div);
    });
});