import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Login from "./components/Login";
import Venues from "./components/Venues";
import Venue from "./components/Venue";
import { Profile, EditProfile } from "./components/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Venues />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="venue/:id" element={<Venue />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="editprofile" element={<EditProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
