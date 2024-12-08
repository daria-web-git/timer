var text = "";
var timer = null;
var remaining = 0;
var paused = false;

function Display() {
    const display = document.getElementById("time-remaining");
    document.title = "Ще " + String(remaining) + " сек";
    display.textContent = "Залишилось: " + String(remaining) + " секунд";
}

function Notify() {
    if (Notification.permission === "granted") {
        if (text != "")
            new Notification(text);
        else
            new Notification("Час минув!");
    } else {
        if (text != "")
            alert(text);
        else
            alert("Час минув!");
    }
}

function Start(interval, repeat = true) {
    text = document.getElementById("text-timer").value;
    remaining = interval;
    Display();

    if (timer) 
        clearInterval(timer);

    timer = setInterval(() => {
        if (paused) return;
        remaining -= 1;
        Display();

        if (remaining <= 0) {
            Notify();
            if (repeat) {
                remaining = interval;
            } else {
                clearInterval(timer);
            }
        }
    }, 1000);
}

function Pause() {
    paused = !paused;
    if (paused)
        document.getElementById("pause").textContent = "Продовжити";
    else
        document.getElementById("pause").textContent = "Зупинити";
}

function Cancel() {
    clearInterval(timer);
    remaining = 0;
    Display();
}

document.getElementById("start").addEventListener("click", () => {
    const interval = parseInt(document.getElementById("interval").value, 10);
    Start(interval);
    paused = false;
});

document.getElementById("pause").addEventListener("click", Pause);

document.getElementById("cancel").addEventListener("click", Cancel);

if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

const params = new URLSearchParams(window.location.search);
const interval = params.get("interval");
if (interval) {
    document.getElementById("interval").value = interval;
    Start(parseInt(interval, 10));
}