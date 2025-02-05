document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const taskDateInput = document.getElementById("taskDate");
    const taskCategoryInput = document.getElementById("taskCategory");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const bucketList = document.getElementById("bucketList");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const darkModeToggle = document.getElementById("darkModeToggle");

    loadTasks();
    checkReminders();

    function addTaskToDOM(taskText, taskDate = "", taskCategory = "Travel", isCompleted = false) {
        const li = document.createElement("li");
        li.draggable = true;
        const categoryClass = taskCategory.toLowerCase().replace(" ", "-");

        li.innerHTML = `
            <div class="task-content">
                <span class="${isCompleted ? 'completed' : ''}">${taskText}</span>
                <small class="due-date">${taskDate ? `Due: ${taskDate}` : ''}</small>
                <span class="category ${categoryClass}">${taskCategory}</span>
            </div>
            <div class="task-btns">
                <button class="complete-btn">${isCompleted ? 'Undo' : 'Complete'}</button>
                <button class="remove-btn">Remove</button>
            </div>
        `;

        if (isCompleted) {
            li.classList.add("completed");
        }

        bucketList.appendChild(li);
        updateProgress();
        saveTasks();

        li.querySelector(".complete-btn").addEventListener("click", function () {
            li.classList.toggle("completed");
            saveTasks();
            updateProgress();
        });

        li.querySelector(".remove-btn").addEventListener("click", function () {
            li.remove();
            saveTasks();
            updateProgress();
        });
    }

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskCategory = taskCategoryInput.value;

        if (taskText !== "") {
            addTaskToDOM(taskText, taskDate, taskCategory);
            taskInput.value = "";
            taskDateInput.value = "";
        }
    });

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll(".bucket-list li").forEach((li) => {
            tasks.push({
                text: li.querySelector("span").innerText,
                date: li.querySelector(".due-date").innerText.replace("Due: ", ""),
                category: li.querySelector(".category").innerText,
                completed: li.classList.contains("completed"),
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach((task) => {
            addTaskToDOM(task.text, task.date, task.category, task.completed);
        });
    }

    function updateProgress() {
        const totalTasks = document.querySelectorAll(".bucket-list li").length;
        const completedTasks = document.querySelectorAll(".bucket-list .completed").length;
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        progressBar.value = progress;
        progressText.innerText = `${progress}% Completed`;
    }

    function checkReminders() {
        setInterval(() => {
            document.querySelectorAll(".bucket-list .due-date").forEach((dateEl) => {
                if (new Date(dateEl.innerText.replace("Due: ", "")) <= new Date()) {
                    alert("Reminder: You have an overdue task!");
                }
            });
        }, 60000);
    }
});
