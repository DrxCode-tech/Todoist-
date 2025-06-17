const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todosStr = localStorage.getItem('todos');
  return todosStr ? JSON.parse(todosStr) : [];
}

function renderTodos() {
  const todos = loadTodos();
  list.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.textContent = todo;

    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.onclick = () => {
      todos.splice(index, 1);
      saveTodos(todos);
      renderTodos();
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const todos = loadTodos();
  todos.push(input.value.trim());
  saveTodos(todos);
  input.value = '';
  renderTodos();
});

renderTodos();
