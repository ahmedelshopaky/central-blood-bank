import { Routes, Route } from "react-router-dom";
import Home from "./body/Home";
import Register from "./body/Register";
import Donate from "./body/Donate";
import NotFound from "./body/NotFound";
import Request from "./body/Request";

export default function Body() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="donate" element={<Donate />} />
      <Route path="request" element={<Request />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
