//Here if one of the API will fail it will return false

// const axios = require('axios');

// async function callAllAPIs() {
//   try {
//     const responses = await Promise.all([
//       axios.get('https://jsonplaceholder.typicode.com/posts/1'),
//       axios.get('https://jsonplaceholder.typicode.com/posts/2'),
//       axios.get('https://jsonplaceholder.typicode.com/posts/3'),
//       axios.get('https://jsonplaceholder.typicode.com/posts/4'),
//       axios.get('https://jsonplaceholder.typicode.com/posts/5')
//     ]);

//     console.log(
//       'All APIs succeeded:',
//       responses.map(r => r.data)
//     );
//   } catch (err) {
//     console.error('Execution stopped:', err.message);
//   }
// }

// callAllAPIs();

//Here if one of the API will fail it will stop the execution 
// const axios = require('axios');

// async function callAPIsSequentially() {
//   try {
//     const urls = [
//       'https://jsonplaceholder.typicode.com/posts/1',
//       'https://jsonplaceholder.typicode.com/posts/2',
//       'https://jsonplaceholder.typicode.com/posts/3',
//       'https://jsonplaceholder.typicode.com/posts/sd',
//       'https://jsonplaceholder.typicode.com/posts/5'
//     ];

//     for (let i = 0; i < urls.length; i++) {
//       const response = await axios.get(urls[i]);
//       console.log(`API ${i + 1} success:`, response.data);
//     }

//     console.log('All APIs executed successfully');
//   } catch (err) {
//     console.error('Execution stopped at failure:', err.message);
//   }
// }
// callAPIsSequentially();


//Here if one of the API will fail it will skip that and execute the next one
const axios = require('axios');

async function callAPIsSequentially() {
  const urls = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/posts/2',
    'https://jsonplaceholder.typicode.com/posts/invalid', // will fail
    'https://jsonplaceholder.typicode.com/posts/4',
    'https://jsonplaceholder.typicode.com/posts/5'
  ];

  for (let i = 0; i < urls.length; i++) {
    try {
      const response = await axios.get(urls[i]);
      console.log(`API ${i + 1} success:`, response.data);
    } catch (err) {
      console.error(`API ${i + 1} failed → skipping`);
    }
  }

  console.log('Execution finished (failed APIs skipped)');
}

callAPIsSequentially();
