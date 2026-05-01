const socket = io();

const usersDiv = document.getElementById("users");

function addUser(id){

    // evitar duplicados
    if(document.getElementById(id)) return;

    const div = document.createElement("div");

    div.className = "user";
    div.id = id;

    div.innerText = "Dispositivo: " + id;

    usersDiv.appendChild(div);
}

socket.on("all-users", (users) => {

    usersDiv.innerHTML = "";

    users.forEach(id => {
        addUser(id);
    });

});

socket.on("new-user", (id) => {
    addUser(id);
});

socket.on("user-left", (id) => {

    const el = document.getElementById(id);

    if(el){
        el.remove();
    }

});