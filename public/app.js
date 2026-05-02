const socket = io();

/*
========================
CUADRO
========================
*/

const uploadBox = document.getElementById("uploadBox");

/*
========================
INPUT OCULTO
========================
*/

const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.multiple = true;
fileInput.hidden = true;

document.body.appendChild(fileInput);

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
SELECCIONAR ARCHIVOS
========================
*/

fileInput.addEventListener("change", (e) => {

    const files = [...e.target.files];

    if(files.length <= 0) return;

    saveFiles(files);
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

    const files = [...e.dataTransfer.files];

    if(files.length <= 0) return;

    saveFiles(files);
});

/*
========================
GUARDAR ARCHIVOS
========================
*/

function saveFiles(files){

    const saved = [];

    files.forEach(file => {

        saved.push({
            name: file.name,
            size: file.size,
            type: file.type
        });

    });

    sessionStorage.setItem(
        "smartfile_files",
        JSON.stringify(saved)
    );

    /*
    ========================
    IR A UPLOAD.HTML
    ========================
    */

    window.location.href = "upload.html";
}

/*
========================
SOCKET
========================
*/

socket.on("connect", () => {

    console.log("Conectado");
});