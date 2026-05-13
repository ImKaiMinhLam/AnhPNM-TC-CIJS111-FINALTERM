import { useMemo, useState } from 'react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

const initialTodos = [
  { id: 1, title: 'Do coding challenges', active: true },
  { id: 2, title: 'Read React document', active: true },
  { id: 3, title: 'Submit final test', active: false },
];

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="trash-icon">
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v9h-2V9Zm4 0h2v9h-2V9ZM7 9h2v10h8V9h2v12H7V9Z" />
    </svg>
  );
}

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState('all');
  const [newTodo, setNewTodo] = useState('');

  const visibleTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter((todo) => todo.active);
    }

    if (filter === 'completed') {
      return todos.filter((todo) => !todo.active);
    }

    return todos;
  }, [filter, todos]);

  const canAddTask = filter !== 'completed';
  const completedCount = todos.filter((todo) => !todo.active).length;

  function handleSubmit(event) {
    event.preventDefault();
    const title = newTodo.trim();

    if (!title || !canAddTask) {
      return;
    }

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: Date.now(),
        title,
        active: true,
      },
    ]);
    setNewTodo('');
  }

  function toggleTodo(todoId) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, active: !todo.active } : todo,
      ),
    );
  }

  function deleteTodo(todoId) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
  }

  function deleteCompletedTodos() {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.active));
  }

  return (
    <main className="page">
      <section className="todo-app" aria-labelledby="todo-title">
        <h1 id="todo-title">#todo</h1>

        <div className="tabs" role="tablist" aria-label="Todo filters">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              className={`tab ${filter === item.id ? 'active' : ''}`}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {canAddTask && (
          <form className="add-form" onSubmit={handleSubmit}>
            <input
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              type="text"
              placeholder="add details"
              aria-label="Task detail"
            />
            <button type="submit">Add</button>
          </form>
        )}

        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <label className="todo-label">
                <input
                  type="checkbox"
                  checked={!todo.active}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={!todo.active ? 'completed' : ''}>{todo.title}</span>
              </label>

              {filter === 'completed' && (
                <button
                  className="delete-button"
                  type="button"
                  aria-label={`Delete ${todo.title}`}
                  onClick={() => deleteTodo(todo.id)}
                >
                  <TrashIcon />
                </button>
              )}
            </li>
          ))}
        </ul>

        {filter === 'completed' && completedCount > 0 && (
          <button className="delete-all" type="button" onClick={deleteCompletedTodos}>
            <TrashIcon />
            delete all
          </button>
        )}
      </section>
    </main>
  );
}

export default App;
