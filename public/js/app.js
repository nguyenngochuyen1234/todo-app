// public/js/app.js
document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();

    document.getElementById('todoForm').addEventListener('submit', (event) => {
        event.preventDefault();
    });

    document.getElementById('todosTable').addEventListener('click', (event) => {
        if (event.target.dataset.action === 'delete') {
            deleteTodo(event.target.dataset.id);
        }
    });
});


function fetchTodos() {
    axios.get('/todos')
        .then(response => {
            const todos = response.data;
            const tbody = document.querySelector('#todosTable tbody');
            tbody.innerHTML = '';

            todos.forEach(todo => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${todo.title}</td>
                    <td>${todo.description}</td>
                    <td>
                        <button data-id="${todo.id}" class="btn btn-danger" data-action="delete">Delete</button>
                        <button data-id="${todo.id}" data-action="edit" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editTodoModal">
  Edit
</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error(error));
}


function addTodo() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    if (title) {
        axios.post('/todos', { title, description })
            .then(() => {
                fetchTodos();
                document.getElementById('title').value = '';
                document.getElementById('description').value = '';
            })
            .catch(error => console.error(error));
    } else {
        alert("Vui lòng nhập tiêu đề của công việc")
    }
}

function deleteTodo(id) {
    axios.delete(`/todos/${id}`)
        .then(() => fetchTodos())
        .catch(error => console.error(error));
}


// public/js/app.js
// ... (phần code còn lại)

document.getElementById('todosTable').addEventListener('click', (event) => {
    if (event.target.dataset.action === 'delete') {
        deleteTodo(event.target.dataset.id);
    } else if (event.target.dataset.action === 'edit') {
        console.log('click')
        openEditModal(event.target.dataset.id);
    }
});

function openEditModal(id) {
    axios.get(`/todos/${id}`)
        .then(response => {
            const todo = response.data;
            console.log({ todo })
            document.getElementById('editTitle').value = todo.title;
            document.getElementById('editDescription').value = todo.description;
            document.getElementById('editTodoId').value = todo.id;
            $('#editTodoModal').modal('show');
        })
        .catch(error => console.error(error));
}
function updateTodo() {
    const id = document.getElementById('editTodoId').value;
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;

    axios.put(`/todos/${id}`, { title, description })
        .then(() => {
            fetchTodos();
            $('#editTodoModal').modal('hide');
        })
        .catch(error => console.error(error));
}

