import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Header from "./components/Header";
import NotFound from "./components/body/NotFound";

function App() {
  return (
    <Router>
      <div className="p-3">
        <Header />
      </div>
      <Body />
    </Router>
  );
}

export default App;
