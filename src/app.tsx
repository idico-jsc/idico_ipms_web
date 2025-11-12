import { BrowserRouter } from "react-router";
import { AppRoutes } from "./app/routes";
import { Providers } from "./providers/providers";

const App = () => {
  // Initialize auth on app load - fetch user if token exists

  return (
    <BrowserRouter>
      <Providers>
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  );
};

export default App;
