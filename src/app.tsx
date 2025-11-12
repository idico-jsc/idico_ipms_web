import { RouterProvider } from "react-router";
import { router } from "./app/routes";
import { Providers } from "./providers/providers";

const App = () => {
  // Initialize auth on app load - fetch user if token exists

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};

export default App;
