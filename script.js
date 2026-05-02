const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const priorityInput = document.getElementById('priority-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';
let search = '';

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

searchInput.addEventListener('input', (e) => {
    search = e.target.value.toLowerCase();
    renderTasks();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter;
        renderTasks();
    });
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const task = {
        id: Date.now(),
        text,
        date: dateInput.value,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(task);
    save();
    taskInput.value = '';
    dateInput.value = '';
    renderTasks();
}

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';

    let filtered = tasks.filter(t => {
        if (filter === 'completed') return t.completed;
        if (filter === 'pending') return !t.completed;
        return true;
    });

    if (search) {
        filtered = filtered.filter(t => t.text.toLowerCase().includes(search));
    }

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <span onclick="toggle(${task.id})">${task.text}</span>
            <div>
                <button onclick="toggle(${task.id})">✔</button>
                <button onclick="remove(${task.id})">❌</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function toggle(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    save();
    renderTasks();
}

function remove(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    renderTasks();
}

renderTasks();