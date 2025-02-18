const cursor = document.querySelector("#cursor-follower")

let mouseX = 0, mouseY = 0;
let posX = 0, posY = 0;
const speed = 0.1; // Adjust for smoother movement

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function cursorAnimate() {
    posX += (mouseX - posX) * speed;
    posY += (mouseY - posY) * speed;
    cursor.style.transform = `translate(${posX}px, ${posY}px)`;
    requestAnimationFrame(cursorAnimate);
}
cursorAnimate();