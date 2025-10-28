import { AuthProvider } from "./contexts/AuthContext";
import { Routers } from "./Routers/Routers";

const App = () => {
  return (
    <AuthProvider>
      <Routers />
    </AuthProvider>
  );
};

export default App;
