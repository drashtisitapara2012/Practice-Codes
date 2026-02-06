async function getPrivateData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/1', {
    cache: 'no-store' // PRIVATE (per-request)
  });

  return res.json();
}

export default async function PrivatePage() {
  const user = await getPrivateData();

  return (
    <div style={{ padding: 24 }}>
      <h1>Private Data</h1>
      <p>This is NOT cached globally</p>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
