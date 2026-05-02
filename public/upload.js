const socket = io();

const files = JSON.parse(localStorage.getItem("smartfiles")) || [];

const previewContainer = document.getElementById("previewContainer");

const progressBar = document.getElementById("progressBar");

const sendBtn = document.getElementById("sendBtn");

const modal = document.getElementById("shareModal");

const devicesDiv = document.getElementById("devices");

const shareUrl = document.getElementById("shareUrl");

let percent = 0;

const interval = setInterval(() => {

    percent += 5;

    progressBar.style.width = percent + "%";

    if(percent >= 100){

        clearInterval(interval);

        loadPreview();
    }

}, 100);

function loadPreview(){

    if(files.length === 0) return;

    const file = files[0];

    if(file.type.startsWith("image")){

        const img = document.createElement("img");

        img.src = "https://placehold.co/600x400";

        previewContainer.appendChild(img);

    }else{

        previewContainer.innerHTML = `
            <div style="
            width:100%;
            height:100%;
            display:flex;
            justify-content:center;
            align-items:center;
            font-size:30px;
            ">
            📁
            </div>
        `;
    }

}

const agent = navigator.userAgent;

let deviceType = "PC";

if(/iPhone/i.test(agent)){
    deviceType = "iPhone";
}

if(/iPad/i.test(agent)){
    deviceType = "iPad";
}

if(/Android/i.test(agent)){
    deviceType = "Android";
}

socket.emit("register-device", {
    type: deviceType
});

socket.on("devices", (devices) => {

    devicesDiv.innerHTML = "";

    if(devices.length === 1){

        devicesDiv.innerHTML = `
            <p>No se detectaron dispositivos</p>
        `;

        return;
    }

    devices.forEach(device => {

        const div = document.createElement("div");

        div.className = "device";

        div.innerHTML = `
            ${device.type}
        `;

        devicesDiv.appendChild(div);

    });

});

sendBtn.addEventListener("click", () => {

    modal.classList.remove("hidden");

    socket.emit("create-share");

});

socket.on("share-created", async (data) => {

    const url = location.origin + data.url;

    shareUrl.value = url;

    QRCode.toCanvas(
        document.getElementById("qr"),
        url
    );

});