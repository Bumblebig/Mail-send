import { useEffect, useState } from "react";
import { Login, Register, Send, Test, Reset, Change } from "./pages";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./firebase";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        <Route
          path="/send-dev"
          element={
            <ProtectedRoute>
              <Send />
            </ProtectedRoute>
          }
        />
        <Route
          path="/custom-mail"
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change"
          element={
            <ProtectedRoute>
              <Change />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
