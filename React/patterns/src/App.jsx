import Dashboard from "./Dashboard";
import withAuth from "./withAuth";

const ProtectedDashboard = withAuth(Dashboard);

export default function App() {
  return <ProtectedDashboard />;
}
