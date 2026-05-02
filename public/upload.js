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

    previewContainer.innerHTML = "";

    files.forEach(file => {

        const item = document.createElement("div");

        item.style.width = "120px";
        item.style.height = "120px";
        item.style.background = "#f2f2f2";
        item.style.borderRadius = "20px";
        item.style.overflow = "hidden";
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.justifyContent = "center";
        item.style.position = "relative";

        if(file.type.startsWith("image")){

            const img = document.createElement("img");

            img.src = file.data;

            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";

            item.appendChild(img);

        }

        else if(file.type.startsWith("video")){

            const video = document.createElement("video");

            video.src = file.data;

            video.currentTime = 1;

            video.muted = true;

            video.style.width = "100%";
            video.style.height = "100%";
            video.style.objectFit = "cover";

            item.appendChild(video);

        }

        else if(file.type.includes("pdf")){

            item.innerHTML = `
                <div style="font-size:55px;">
                    📕
                </div>
            `;

        }

        else{

            item.innerHTML = `
                <div style="font-size:55px;">
                    📁
                </div>
            `;

        }

        previewContainer.appendChild(item);

    });

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
    userAgent: navigator.userAgent
});

function getDeviceType(ua){

    if(!ua){
        return {
            name:"Dispositivo",
            icon:"💻"
        };
    }

    if(ua.includes("iPhone")){
        return {
            name:"iPhone",
            icon:"📱"
        };
    }

    if(ua.includes("iPad")){
        return {
            name:"iPad",
            icon:"📲"
        };
    }

    if(ua.includes("Android")){

        if(ua.includes("Mobile")){
            return {
                name:"Telefono Android",
                icon:"📱"
            };
        }

        return {
            name:"Tablet Android",
            icon:"📲"
        };
    }

    if(ua.includes("Mac")){
        return {
            name:"Mac",
            icon:"🖥️"
        };
    }

    if(ua.includes("Windows")){
        return {
            name:"PC Windows",
            icon:"💻"
        };
    }

    return {
        name:"Dispositivo",
        icon:"💻"
    };
}

   socket.on("devices", (devices) => {

    devicesDiv.innerHTML = "";

    const otherDevices = devices.filter(
        d => d.id !== socket.id
    );

    if(otherDevices.length === 0){

        devicesDiv.innerHTML = `
            <p>No se detectaron dispositivos</p>
        `;

        return;
    }

    otherDevices.forEach(device => {

        const info = getDeviceType(device.userAgent);

        const div = document.createElement("div");

        div.className = "device";

        div.innerHTML = `
            <div style="
                display:flex;
                align-items:center;
                gap:15px;
            ">

                <div style="
                    font-size:35px;
                ">
                    ${info.icon}
                </div>

                <div>

                    <div style="
                        font-size:18px;
                        font-weight:bold;
                    ">
                        ${info.name}
                    </div>

                    <div style="
                        color:gray;
                    ">
                        En linea
                    </div>

                </div>

            </div>
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