//useDeferredValue lets React delay non-urgent renders so urgent updates like typing stay responsive.
//useDeferredValue(value, initialValue?)
import React, { useDeferredValue } from "react";

function slowFilter(list, query) {
  const start = performance.now();
  while (performance.now() - start < 80) {
    // block CPU for ~80ms
  }

  return list.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );
}

const ITEMS = Array.from({ length: 2000 }, (_, i) => `Item ${i}`);

export default function WithDeferred() {
  const [query, setQuery] = React.useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredItems = slowFilter(ITEMS, deferredQuery);
  const isStale = query !== deferredQuery;

  return (
    <div>
      <h3>With useDeferredValue</h3>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Type fast..."
      />

      {isStale && <p>Updating results...</p>}

      <ul>
        {filteredItems.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// WITHOUT DEFERRED.........
// const ITEMS = Array.from({ length: 2000 }, (_, i) => `Item ${i}`);

// export default function WithoutDeferred() {
//   const [query, setQuery] = React.useState("");

//   const filteredItems = slowFilter(ITEMS, query);

//   return (
//     <div>
//       <h3> Without useDeferredValue</h3>
//       <input
//         value={query}
//         onChange={e => setQuery(e.target.value)}
//         placeholder="Type fast..."
//       />
//       <ul>
//         {filteredItems.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }