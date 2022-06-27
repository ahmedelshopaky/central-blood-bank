import { BrowserRouter as Router } from "react-router-dom";
import Body from "./components/Body";
import Header from "./components/Header";

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
