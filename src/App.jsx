import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
