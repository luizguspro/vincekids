import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Colecao from "./pages/Colecao";
import Produto from "./pages/Produto";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/colecao" component={Colecao} />
          <Route path="/produto/:id" component={Produto} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
