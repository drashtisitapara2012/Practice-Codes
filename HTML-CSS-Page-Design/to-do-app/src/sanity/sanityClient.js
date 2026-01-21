// src/sanity/sanityClient.js
import { client } from './client';

// Fetch all todos from Sanity
export const fetchTodos = async () => {
  try {
    const query = `*[_type == "todo"] | order(_createdAt desc) {
      _id,
      _createdAt,
      title,
      completed,
      priority,
      dueDate,
      description,
      reminder,
      reminderAt,
      notified
    }`;
    
    const todos = await client.fetch(query);
    console.log('Fetched todos from Sanity:', todos);
    return todos;
  } catch (error) {
    console.error(' Error fetching todos:', error);
    throw error;
  }
};

// Create a new todo in Sanity
export const createTodo = async (todoData) => {
  try {
    const newTodo = await client.create({
      _type: 'todo',
      title: todoData.title,
      description: todoData.description || '',
      priority: todoData.priority || 'Medium',
      dueDate: todoData.dueDate || '',
      completed: false,
      reminder: todoData.reminder || null,
      reminderAt: todoData.reminderAt || null,
      notified: false,
    });
    
    console.log(' Created todo:', newTodo);
    return newTodo;
  } catch (error) {
    console.error(' Error creating todo:', error);
    throw error;
  }
};

// Update a todo in Sanity
export const updateTodo = async (id, updates) => {
  try {
    const updatedTodo = await client
      .patch(id)
      .set(updates)
      .commit();
    
    console.log('Updated todo:', updatedTodo);
    return updatedTodo;
  } catch (error) {
    console.error(' Error updating todo:', error);
    throw error;
  }
};

// Delete a todo from Sanity
export const deleteTodoById = async (id) => {
  try {
    await client.delete(id);
    console.log(' Deleted todo:', id);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};