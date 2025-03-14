let todos = [];

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

export default async function handler(req, res) {
    if (req.method === "GET") {
        // Send all todos
        res.status(200).json(todos);
    } else if (req.method === "POST") {
        // Add a new todo
        const newTodo = JSON.parse(req.body);
        const todo = { id: generateId(), task: newTodo.task, completed: false };
        todos.push(todo);
        res.status(201).json(todo);
    } else if (req.method === "PATCH") {
        const { id } = req.query;

        if (req.body && req.body.task) {
            // Edit a task
            const updatedTodo = todos.find(todo => todo.id === id);
            if (updatedTodo) {
                updatedTodo.task = req.body.task;
                res.status(200).json(updatedTodo);
            } else {
                res.status(404).end();
            }
        } else if (req.body && req.body.completed !== undefined) {
            // Mark a task as complete
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                todo.completed = true;
                res.status(200).json(todo);
            } else {
                res.status(404).end();
            }
        }
    } else if (req.method === "DELETE") {
        const { id } = req.query;
        todos = todos.filter(todo => todo.id !== id);
        res.status(200).end();
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
