import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "../../routing/src/components/Layout";
import ProtectedRoute from "../../routing/src/components/ProtectedRoute";

import Home from "../../routing/src/pages/Home";
import Products from "../../routing/src/pages/Products";
import ProductDetails from "../../routing/src/pages/ProductDetails";
import Login from "../../routing/src/pages/Login";
import Dashboard from "../../routing/src/pages/Dashboard";
import Profile from "../../routing/src/pages/Profile";
import Settings from "../../routing/src/pages/Settings";
import NotFound from "../../routing/src/pages/NotFound";

// Lazy loaded page
const About = lazy(() => import("../../routing/src/pages/About"));

function App() {
  return (
    <Suspense fallback={<h3>Loading...</h3>}>
      <Routes>

        {/* Layout Route */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />

          {/* Protected + Nested Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<h3>Dashboard Home</h3>} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
