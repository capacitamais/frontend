import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Home from "./components/pages/auth/Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
