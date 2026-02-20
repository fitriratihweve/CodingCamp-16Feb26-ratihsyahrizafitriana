// Ambil elemen
const todoInput = document.getElementById("todo-input");
const todoDate = document.getElementById("todo-date");
const todoList = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all"; // all, active, completed

// Tampilkan todos saat halaman dibuka
document.addEventListener("DOMContentLoaded", renderTodos);

// =======================
// ADD TODO
// =======================
function addTodo() {
    const text = todoInput.value.trim();
    const date = todoDate.value;

    if (text === "") {
        alert("Todo tidak boleh kosong!");
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        date: date,
        completed: false
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();

    todoInput.value = "";
    todoDate.value = "";
}

// =======================
// RENDER TODOS
// =======================
function renderTodos() {
    todoList.innerHTML = "";

    let filteredTodos = todos.filter(todo => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = "<li>No todos available</li>";
        return;
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center border p-2 rounded mb-2";

        li.innerHTML = `
            <div>
                <input type="checkbox" ${todo.completed ? "checked" : ""} 
                    onchange="toggleComplete(${todo.id})">
                <span class="${todo.completed ? "line-through text-gray-400" : ""}">
                    ${todo.text}
                </span>
                <small class="block text-gray-500">${todo.date || ""}</small>
            </div>

            <button onclick="deleteTodo(${todo.id})"
                class="bg-red-500 text-white px-2 py-1 rounded">
                Delete
            </button>
        `;

        todoList.appendChild(li);
    });
}

// =======================
// TOGGLE COMPLETE
// =======================
function toggleComplete(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

// =======================
// DELETE TODO
// =======================
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// =======================
// DELETE ALL
// =======================
function deleteAllTodo() {
    if (confirm("Hapus semua todo?")) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// =======================
// FILTER TODOS
// =======================
function filterTodos() {
    const choice = prompt(
        "Ketik:\nall = semua\nactive = belum selesai\ncompleted = selesai"
    );

    if (choice === "all" || choice === "active" || choice === "completed") {
        currentFilter = choice;
        renderTodos();
    } else {
        alert("Pilihan tidak valid");
    }
}

// Hubungkan tombol filter
document.getElementById("filter-btn").onclick = filterTodos;

// =======================
// LOCAL STORAGE
// =======================
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}