const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;

// Background color for inclusion when toggled
const backgroundColor = "#ffffff"; // White

// Function to set the background on a given context
function setBackground(ctxToSet) {
    ctxToSet.fillStyle = backgroundColor;
    ctxToSet.fillRect(0, 0, canvas.width, canvas.height);
}

// Event listeners for drawing
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing); // Stop drawing when mouse leaves canvas
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);
canvas.addEventListener("touchmove", draw);

function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    const { x, y } = getCursorPosition(event);
    ctx.moveTo(x, y);
    event.preventDefault(); // Prevent scrolling on touch devices
}

function stopDrawing(event) {
    if (!drawing) return;
    drawing = false;
    ctx.closePath();
    event.preventDefault();
}

function draw(event) {
    if (!drawing) return;
    const { x, y } = getCursorPosition(event);
    ctx.lineTo(x, y);
    ctx.strokeStyle = document.getElementById("colorPicker").value;
    ctx.lineWidth = document.getElementById("brushSize").value;
    ctx.stroke();
    event.preventDefault();
}

function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }
    return { x, y };
}

// Clear the canvas
document.getElementById("clearCanvas").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Download the canvas as a PNG image
document.getElementById("download").addEventListener("click", () => {
    const includeBackground = document.getElementById("includeBackground").checked;

    if (includeBackground) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");

        setBackground(tempCtx);
        tempCtx.drawImage(canvas, 0, 0);

        const link = document.createElement("a");
        link.download = "disegno.png";
        link.href = tempCanvas.toDataURL("image/png");
        link.click();
    } else {
        const link = document.createElement("a");
        link.download = "disegno.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }
});

// Upload the drawing to the server
document.getElementById("upload").addEventListener("click", () => {
    const includeBackground = document.getElementById("includeBackground").checked;
    let imageData;

    if (includeBackground) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");

        setBackground(tempCtx);
        tempCtx.drawImage(canvas, 0, 0);

        imageData = tempCanvas.toDataURL("image/png");
    } else {
        imageData = canvas.toDataURL("image/png");
    }

    fetch("/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert("Disegno caricato con successo!");
        })
        .catch((error) => {
            console.error("Errore durante il caricamento:", error);
            alert("Errore durante il caricamento. Controlla la console per maggiori dettagli.");
        });
});
