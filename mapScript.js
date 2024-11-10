let mapaImg; // Obrázek mapy
let ponorkaImg; // Obrázek ponorky
let markers = []; // Pole pro uchovávání markerů
let canvasWidth, canvasHeight; // Rozměry canvasu
let ponorkaX = 100, ponorkaY = 100; // Počáteční pozice ponorky
let targetX, targetY; // Cílové souřadnice ponorky
let isMoving = false; // Flag pro pohyb ponorky
let speed = 2; // Rychlost pohybu ponorky

function preload() {
    // Načteme obrázek mapy a ponorky
    mapaImg = loadImage('mapa.png');
    ponorkaImg = loadImage('ponorka.png');
}

function setup() {
    // Inicializujeme canvas a vycentrujeme ho
    createCanvas(windowWidth, windowHeight);
    noLoop(); // Nechceme, aby se vykreslovalo neustále

    // Přidáme pár markerů pro ukázku
    addMarker(200, 300, "Místnost 1");
    addMarker(400, 500, "Místnost 2");
    addMarker(600, 700, "Zajímavé místo");

    // Nastavíme počáteční velikost canvasu
    updateCanvasSize();
}

function draw() {
    // Aktualizujeme velikost canvasu při změně okna
    updateCanvasSize();

    // Vyčistíme canvas
    background(240);

    // Vykreslíme obrázek mapy, který se automaticky přizpůsobí velikosti canvasu
    let imgAspect = mapaImg.width / mapaImg.height;
    let newHeight = canvasHeight; // Výška canvasu je rovná výšce okna
    let newWidth = newHeight * imgAspect; // Šířka se přizpůsobí poměru

    imageMode(CENTER);
    image(mapaImg, canvasWidth / 2, canvasHeight / 2, newWidth, newHeight);

    // Vykreslíme všechny markerky
    for (let i = 0; i < markers.length; i++) {
        let m = markers[i];
        fill(255, 0, 0);
        noStroke();
        ellipse(m.x, m.y, 20, 20); // Marker jako kruh
        fill(0);
        textSize(12);
        textAlign(CENTER, CENTER);
        text(m.label, m.x, m.y - 15); // Nápis nad markerem
    }

    // Vykreslíme souřadnicové osy
    drawAxes(newWidth, newHeight);

    // Zobrazíme souřadnice myši
    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`, 20, 20);

    // Pokud je ponorka v pohybu, pohne se směrem k cílovým souřadnicím
    if (isMoving) {
        moveSubmarine();
    }

    // Vykreslíme ponorku na její aktuální pozici
    imageMode(CENTER);
    image(ponorkaImg, ponorkaX, ponorkaY);
}

function addMarker(x, y, label) {
    // Přidáme marker s danými souřadnicemi a popisem
    markers.push({x: x, y: y, label: label});
}

function drawAxes(imgWidth, imgHeight) {
    // Souřadnicové osy
    stroke(0);
    line(50, imgHeight / 2, imgWidth + 50, imgHeight / 2); // Os X
    line(imgWidth / 2, 50, imgWidth / 2, imgHeight + 50); // Os Y

    // Označení čísel na osách
    for (let i = 0; i <= imgWidth; i += 100) {
        textSize(12);
        text(i, 50 + i, imgHeight / 2 - 10); // Čísla na ose X
    }

    for (let j = 0; j <= imgHeight; j += 100) {
        textSize(12);
        text(j, imgWidth / 2 + 10, 50 + j); // Čísla na ose Y
    }

    // Přidání šipek na konce os
    triangle(imgWidth + 50, imgHeight / 2 - 5, imgWidth + 50, imgHeight / 2 + 5, imgWidth + 60, imgHeight / 2); // Šipka na ose X
    triangle(imgWidth / 2 - 5, 50, imgWidth / 2 + 5, 50, imgWidth / 2, 40); // Šipka na ose Y
}

function updateCanvasSize() {
    // Nastavení šířky a výšky canvasu podle velikosti okna
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;

    // Přizpůsobíme velikost canvasu
    resizeCanvas(canvasWidth, canvasHeight);
}

function mousePressed() {
    // Zjišťujeme, zda bylo kliknuto na nějaký marker
    for (let i = 0; i < markers.length; i++) {
        let m = markers[i];
        let d = dist(mouseX, mouseY, m.x, m.y);
        if (d < 20) { // Pokud kliknete na marker
            targetX = m.x;
            targetY = m.y;
            isMoving = true; // Začneme pohyb ponorky
            break;
        }
    }
}

function moveSubmarine() {
    // Pohyb ponorky směrem k cílovým souřadnicím
    let dx = targetX - ponorkaX;
    let dy = targetY - ponorkaY;
    let distToTarget = dist(ponorkaX, ponorkaY, targetX, targetY);

    if (distToTarget > speed) {
        // Spočítáme směr pohybu
        let angle = atan2(dy, dx);
        ponorkaX += cos(angle) * speed;
        ponorkaY += sin(angle) * speed;
    } else {
        // Pokud je ponorka u cíle, zastavíme pohyb
        ponorkaX = targetX;
        ponorkaY = targetY;
        isMoving = false; // Ponorka je na místě
    }
}
