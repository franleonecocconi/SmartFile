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

    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener("change", () => {
    handleFiles(fileInput.files);
});

function handleFiles(files){

    const allFiles = [];

    Array.from(files).forEach(file => {

        const reader = new FileReader();

        reader.onload = () => {

            allFiles.push({
                name:file.name,
                type:file.type,
                size:file.size,
                data:reader.result
            });

            if(allFiles.length === files.length){

                localStorage.setItem(
                    "smartfiles",
                    JSON.stringify(allFiles)
                );

                window.location.href = "/upload.html";
            }

        };

        reader.readAsDataURL(file);

    });

}