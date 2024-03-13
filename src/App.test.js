import { fireEvent, render, screen } from '@testing-library/react';
import TodoApp from './App';

afterEach(() => {
  localStorage.clear();
});

test('allows the user to add a new task', () => {
  render(<TodoApp />);
  const input = screen.getByLabelText(/add task/i);
  const button = screen.getByRole('button', { name: /add/i });

  fireEvent.change(input, { target: { value: 'Learn React Testing' } });
  fireEvent.click(button);

  expect(screen.getByText(/learn react testing/i)).toBeInTheDocument();
});

test('allows the user to toggle a task\'s completion status', async () => {
  render(<TodoApp />);
  const input = screen.getByLabelText(/add task/i);
  const addButton = screen.getByRole('button', { name: /add/i });

  fireEvent.change(input, { target: { value: 'Test Task' } });
  fireEvent.click(addButton);

  // Assuming the toggle button is always the first button in each task item,
  // and considering you might have multiple tasks, we aim to click the first toggle found.
  const taskItems = await screen.findAllByRole('button', { name: /Mark as done/ }); // Adjust based on your actual aria-label for the toggle button.
  fireEvent.click(taskItems[0]); // This clicks the first toggle button for the first task.

  // Clicking the toggle button changes its aria-label, check for that.
  expect(taskItems[0]).toHaveAttribute('aria-label', 'Mark as not done');
});

test('allows the user to clear the list', () => {
  // Mock window.confirm to always return true
  window.confirm = jest.fn(() => true);

  // Assuming tasks are added and rendered
  render(<TodoApp />);

  // Simulate adding tasks as in previous tests
  const input = screen.getByLabelText(/add task/i);
  const button = screen.getByRole('button', { name: /add/i });
  fireEvent.change(input, { target: { value: 'Learn React Testing' } });
  fireEvent.click(button);

  expect(screen.getByText(/learn react testing/i)).toBeInTheDocument();

  // Simulate clearing the list
  const clearButton = screen.getByRole('button', { name: /Clear all tasks/i });
  fireEvent.click(clearButton);

  // Adjust this expectation based on how your app responds to an empty list, e.g., displaying a message
  expect(screen.queryByText(/learn react testing/i)).not.toBeInTheDocument();
});
