import { Routes, Route } from "react-router-dom";
import Home from "./body/Home";
import Register from "./body/Register";
import Donate from "./body/Donate";
import NotFound from "./body/NotFound";

export default function Body() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="donate" element={<Donate />} />
      {/* <Route path="eequest" element={<Request />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
