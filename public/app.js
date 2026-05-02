const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

dropZone.addEventListener("click", () => {
    fileInput.click();
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
});

dropZone.addEventListener("drop", (e) => {

    e.preventDefault();

    const files = e.dataTransfer.files;

    saveFiles(files);
});

fileInput.addEventListener("change", () => {
    saveFiles(fileInput.files);
});

function saveFiles(files){

    const array = [];

    for(const file of files){

        array.push({
            name:file.name,
            type:file.type,
            size:file.size
        });

    }

    localStorage.setItem("smartfiles", JSON.stringify(array));

    window.location.href = "/upload.html";
}