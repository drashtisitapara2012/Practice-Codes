// In your Sanity studio: schemas/todo.js
export default {
  name: 'todo',
  type: 'document',
  title: 'Todo',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required()
    },
    {
      name: 'completed',
      type: 'boolean',
      title: 'Completed',
      initialValue: false
    },
    {
      name: 'priority',
      type: 'string',
      title: 'Priority',
      options: {
        list: ['Low', 'Medium', 'High']
      },
      initialValue: 'Medium'
    },
    {
      name: 'dueDate',
      type: 'datetime',
      title: 'Due Date'
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description'
    }
  ]
}