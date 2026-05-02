const socket = io();

/*
========================
ELEMENTOS
========================
*/

const uploadBox = document.getElementById("uploadBox");

const fileInput = document.getElementById("fileInput");
const folderInput = document.getElementById("folderInput");

const chooseFiles = document.getElementById("chooseFiles");
const chooseFolder = document.getElementById("chooseFolder");

/*
========================
BOTONES
========================
*/

chooseFiles.addEventListener("click", (e) => {

    e.stopPropagation();

    fileInput.click();
});

chooseFolder.addEventListener("click", (e) => {

    e.stopPropagation();

    folderInput.click();
});

/*
========================
CLICK EN EL CUADRO
========================
*/

uploadBox.addEventListener("click", () => {
    fileInput.click();
});

/*
========================
ARCHIVOS
========================
*/

fileInput.addEventListener("change", (e) => {

    const files = [...e.target.files];

    if(files.length === 0) return;

    processFiles(files);
});

/*
========================
CARPETAS
========================
*/

folderInput.addEventListener("change", (e) => {

    const files = [...e.target.files];

    if(files.length === 0) return;

    processFiles(files);
});

/*
========================
DRAG & DROP
========================
*/

uploadBox.addEventListener("dragover", (e) => {

    e.preventDefault();

    uploadBox.classList.add("dragging");
});

uploadBox.addEventListener("dragleave", () => {

    uploadBox.classList.remove("dragging");
});

uploadBox.addEventListener("drop", (e) => {

    e.preventDefault();

    uploadBox.classList.remove("dragging");

    const files = [...e.dataTransfer.files];

    if(files.length === 0) return;

    processFiles(files);
});

/*
========================
PROCESAR ARCHIVOS
========================
*/

function processFiles(files){

    const savedFiles = [];

    files.forEach(file => {

        savedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type
        });

    });

    sessionStorage.setItem(
        "smartfile_files",
        JSON.stringify(savedFiles)
    );

    window.location.href = "upload.html";
}

/*
========================
WEBSOCKET
========================
*/

socket.on("connect", () => {
    console.log("Conectado al servidor");
});

/*
========================
WEBRTC
========================
*/

const peer = new RTCPeerConnection();

/*
========================
DEVICE INFO
========================
*/

function getDeviceType(){

    const agent = navigator.userAgent;

    if(agent.includes("iPhone")){
        return "iPhone";
    }

    if(agent.includes("iPad")){
        return "iPad";
    }

    if(agent.includes("Android")){

        if(agent.includes("Mobile")){
            return "Teléfono Android";
        }

        return "Tablet Android";
    }

    if(agent.includes("Mac")){
        return "Mac";
    }

    if(agent.includes("Windows")){
        return "PC Windows";
    }

    return "Dispositivo";
}

console.log("Dispositivo:", getDeviceType());