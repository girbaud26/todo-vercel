document.getElementById("add-todo").addEventListener("click", addTodo);

function addTodo() {
    const todoInput = document.getElementById("new-todo");
    const todoText = todoInput.value.trim();
    
    if (todoText === "") return;

    // Send the new todo to the backend API
    fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ task: todoText }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        displayTodo(data);
        todoInput.value = "";
    });
}

function fetchTodos() {
    fetch("/api/todos")
    .then(response => response.json())
    .then(data => {
        data.forEach(todo => {
            displayTodo(todo);
        });
    });
}

function displayTodo(todo) {
    const todoList = document.getElementById("todo-list");
    const li = document.createElement("li");
    li.setAttribute('data-id', todo.id);

    const taskText = document.createElement("span");
    taskText.textContent = todo.task;
    if (todo.completed) {
        taskText.classList.add("completed");
    }

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.classList.add("complete");
    completeButton.addEventListener("click", () => completeTodo(todo.id));

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit");
    editButton.addEventListener("click", () => editTodo(todo.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(taskText);
    li.appendChild(completeButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    todoList.appendChild(li);
}

function completeTodo(id) {
    fetch(`/api/todos/${id}/complete`, { method: 'PATCH' })
        .then(response => response.json())
        .then(data => {
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            taskElement.querySelector("span").classList.add("completed");
        });
}

function editTodo(id) {
    const newTask = prompt("Edit your task:");
    if (newTask) {
        fetch(`/api/todos/${id}/edit`, {
            method: 'PATCH',
            body: JSON.stringify({ task: newTask }),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            taskElement.querySelector("span").textContent = data.task;
        });
    }
}

function deleteTodo(id) {
    fetch(`/api/todos/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        taskElement.remove();
    });
}

// Fetch and display todos on page load
document.addEventListener("DOMContentLoaded", fetchTodos);
