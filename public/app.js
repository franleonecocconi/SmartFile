const fileInput = document.getElementById("fileInput");
const folderInput = document.getElementById("folderInput");

const chooseFiles = document.getElementById("chooseFiles");
const chooseFolder = document.getElementById("chooseFolder");

chooseFiles.onclick = () => {
    fileInput.click();
};

chooseFolder.onclick = () => {
    folderInput.click();
};

fileInput.addEventListener("change", (e)=>{
    handleFiles([...e.target.files]);
});

folderInput.addEventListener("change", (e)=>{
    handleFiles([...e.target.files]);
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