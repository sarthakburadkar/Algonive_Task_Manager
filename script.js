let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function addTask() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const dueDate = document.getElementById("dueDate").value;

    if (title === "" || dueDate === "") {
        alert("Please enter task title and due date");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        description: description,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    clearForm();
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        if (
            currentFilter === "completed" && !task.completed ||
            currentFilter === "pending" && task.completed
        ) {
            return;
        }

        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        if (task.completed) taskDiv.classList.add("completed");

        taskDiv.innerHTML = `
    <div class="task-header">
        <strong>${task.title}</strong>
        <span class="due-badge">${task.dueDate}</span>
    </div>

    <div class="task-body">
        <p>${task.description}</p>
    </div>

    <div class="task-actions">
        <button class="complete-btn" onclick="toggleTask(${task.id})">
            ${task.completed ? "Undo" : "Complete"}
        </button>
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    </div>
`;


        taskList.appendChild(taskDiv);

        checkReminder(task);
    });
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    displayTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("dueDate").value = task.dueDate;

    deleteTask(id);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks();
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
    document.getElementById(filter).classList.add("active");
    displayTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
}

function checkReminder(task) {
    const today = new Date().toISOString().split("T")[0];
    if (task.dueDate === today && !task.completed) {
        alert(`Reminder: "${task.title}" is due today`);
    }
}

displayTasks();
