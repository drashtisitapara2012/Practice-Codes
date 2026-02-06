export default {
  name: 'staticContent',
  type: 'document',
  title: 'Static Content',
  fields: [
    {
      name: 'key',
      type: 'string',
      title: 'Key',
      description: 'Unique identifier for this content (e.g., "appTitle", "addButtonText")',
      validation: Rule => Rule.required()
    },
    {
      name: 'value',
      type: 'string',
      title: 'Value',
      description: 'The actual text content',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
      description: 'Group related content together',
      options: {
        list: [
          { title: 'App Info', value: 'appInfo' },
          { title: 'Buttons', value: 'buttons' },
          { title: 'Labels', value: 'labels' },
          { title: 'Placeholders', value: 'placeholders' },
          { title: 'Messages', value: 'messages' },
          { title: 'Validation', value: 'validation' }
        ]
      }
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Optional note about where/how this content is used'
    }
  ]
}