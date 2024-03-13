import { useState, useEffect } from 'react';
import './App.css';

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const savedState = localStorage.getItem(key);
      return savedState ? JSON.parse(savedState) : initialValue;
    }
    catch (e) {
      console.error('Error loading state from localStorage:', e);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

function TodoApp() {
  const [tasks, setTasks] = useLocalStorageState('tasks', []); // array of { title, status }
  const [newTask, setNewTask] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(false);

  const handleAddTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, { title: newTask, status: 'not-done' }]);
    setNewTask('');
  };

  const handleDone = (index, status) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], status: status === 'done' ? 'not-done' : 'done' };
    setTasks(newTasks);
  };

  const handleRemove = (index) => {
    const del = window.confirm('Are you sure you want to remove this task?');
    if (!del) return;
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    const del = window.confirm('Are you sure you want to clear all tasks?');
    if (!del) return;
    setTasks([]);
    localStorage.removeItem('tasks');
  };

  return (
    <div className="App">
      <form className="App-header" onSubmit={handleAddTask}>
      <label htmlFor="newTask">Add Task</label>
        <input
          id="newTask"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          aria-required="true"
        />
        <button className="App-add-task-btn">Add</button>
      </form>
      <div className="App-controls">
        <label>
          <input
            type="checkbox"
            checked={filterCompleted}
            onChange={() => setFilterCompleted(!filterCompleted)}
          />
          Hide incomplete tasks
        </label>
        <button
          className="text-button"
          type="button"
          onClick={() => handleClear()}
          aria-label="Clear all tasks"
        >
          Clear list
        </button>
      </div>
      {tasks.length > 0 && (
        <ul>
          {tasks.map(({ title, status }, index) => filterCompleted && status !== 'done' ? null : (
            <li key={index}>
              <button
                className="task-toggle"
                type="button"
                onClick={() => handleDone(index, status)}
                aria-label={status === 'done' ? 'Mark as not done' : 'Mark as done'}
              >
                {status === 'done' ? '✅' : '⭕️'}
              </button>
              <span>
                {title}
              </span>
              <button
                className="text-button"
                type="button"
                onClick={() => handleRemove(index)}
                aria-label="Remove task"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoApp;

