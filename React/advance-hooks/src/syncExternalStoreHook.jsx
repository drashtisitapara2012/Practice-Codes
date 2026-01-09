//useSyncExternalStore is used to safely subscribe to external data sources so React always renders a consistent snapshot, even in concurrent rendering.

import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot } from "./onlineStore";

export default function SyncExternalStore() {
  const online = useSyncExternalStore(
    subscribe,
    getSnapshot
  );

  return (
    <div style={{ fontSize: "24px" }}>
      Status: {online ? "🟢 Online" : "🔴 Offline"}
    </div>
  );
}
