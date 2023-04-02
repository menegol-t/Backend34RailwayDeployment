const prodButtons = document.getElementsByClassName("comprarbtn")
const ownerEmail = document.querySelector("#userEmailProd").textContent

const socket = io()

for(let i = 0; i < prodButtons.length; i++) {
    prodButtons[i].addEventListener("click", () => {
        const order = {
            owner: ownerEmail,
            prodId: prodButtons[i].id
        }
        socket.emit("addProdToCart", order)
    });
}

socket.on("prodAddedToCart", (added) => {
    added == true ? toast() : err()
})

function toast(){
    Toastify({
        text: "Producto añadido al carrito exitosamente!",
        duration: 3000,
        gravity: "bottom",
        style: {
            background: "#E0A367",
          }
    }).showToast();
}

function err(){
    Toastify({
        text: "Hubo un error. Intenta de vuelta en unos segundos.",
        duration: 5000,
        gravity: "bottom",
        style: {
            background: "#E0A367",
          }
    }).showToast();
}