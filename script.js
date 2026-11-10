// موعد الامتحانات
const examDate = new Date(2027, 5, 12, 0, 0, 0).getTime();

// بداية حساب شريط التقدم
const startDate = new Date(2026, 10, 10).getTime();

// العداد التنازلي
function updateCountdown() {

    const now = Date.now();
    const distance = examDate - now;

    if (distance <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        document.querySelector(".hero h1").textContent =
            "لقد بدأت امتحانات البكالوريا! 🎓";

        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

    // شريط التقدم
    const total = examDate - startDate;
    const passed = now - startDate;

    let progress = Math.max(0, Math.min(100, (passed / total) * 100));

    document.getElementById("progressBar").style.width =
        progress + "%";

    document.getElementById("progressText").textContent =
        progress.toFixed(1) + "%";
}

updateCountdown();
setInterval(updateCountdown, 1000);


// الرسائل التحفيزية
const quotes = [
    "النجاح يبدأ بخطوة، استمر ولا تستسلم.",
    "تعب النهارده هو فرحة بكرة.",
    "أنت قادر تحقق حلمك، ثق بنفسك.",
    "كل ساعة مذاكرة بتفرق في مستقبلك.",
    "لا تقارن بدايتك بنهاية الآخرين.",
    "اجعل هدفك أكبر من أي عقبة.",
    "مستقبلك يستحق منك المحاولة."
];

let quoteIndex = 0;

setInterval(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;

    document.getElementById("quote").textContent =
        quotes[quoteIndex];

}, 7000);


// الوضع الليلي والنهاري
const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeBtn.textContent = "🌙";
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");

    themeBtn.textContent = isLight ? "🌙" : "☀️";

    localStorage.setItem("theme", isLight ? "light" : "dark");

});


// قائمة أهداف المذاكرة
let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const item = document.createElement("div");
        item.className = "task-item";

        if (task.done) {
            item.classList.add("done");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;

        checkbox.addEventListener("change", () => {
            tasks[index].done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.name;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-task";
        deleteBtn.textContent = "×";

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        item.append(checkbox, span, deleteBtn);
        taskList.appendChild(item);

    });

    const completed = tasks.filter(task => task.done).length;

    document.getElementById("taskCount").textContent =
        completed + " من " + tasks.length + " أهداف مكتملة";
}


// إضافة هدف جديد
function addTask() {

    const value = taskInput.value.trim();

    if (value === "") {
        alert("اكتب هدف المذاكرة الأول!");
        return;
    }

    tasks.push({
        name: value,
        done: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

document.getElementById("addTask").addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});


// مسح جميع الأهداف
document.getElementById("clearTasks").addEventListener("click", () => {

    if (tasks.length === 0) return;

    if (confirm("هل أنت متأكد أنك تريد مسح جميع الأهداف؟")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }

});

renderTasks();