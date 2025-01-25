import { Login, Register, Send, Test } from "./pages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <section>
      <Router>
        <Routes>
          <Route element={<Login />} path="/"></Route>
          <Route element={<Login />} path="/login"></Route>
          <Route element={<Register />} path="/register"></Route>
          <Route element={<Send />} path="/send-dev"></Route>
          <Route element={<Test />} path="/custom-mail"></Route>
        </Routes>
      </Router>
    </section>
  )
}

export default App
