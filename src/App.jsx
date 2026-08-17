import "./App.css";
import { authUser } from "./services/authService";
import { ShowAuth } from "./components/Auth";
import { useForm } from "./hooks/useForm";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/auth";
import { getRoutines } from "./services/routineService";
const initialFormState = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { formData, result, handleChange, handleSubmit } = useForm(
    initialFormState,
    authUser,
    showLogin ? "login" : "register",
  );
  const { isAuthenticated, logout, user, token } = useContext(AuthContext);
  const [routines, setRoutines] = useState();

  useEffect(() => {
    if (isAuthenticated) {
      getRoutines().then((routines) => setRoutines(routines));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log(routines);
  }, [routines]);

  return (
    <>
      <h1>Fittracker</h1>
      {!isAuthenticated ? (
        <ShowAuth
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formData={formData}
          result={result.message}
          showLogin={showLogin}
          handleLoginClick={() => setShowLogin(!showLogin)}
        ></ShowAuth>
      ) : (
        <main>
          <header>
            <button onClick={() => logout()}>Cerrar sesión</button>
          </header>

          <h2>Rutinas de {`${user.name}`}</h2>

          <div className="routines">
            {routines &&
              routines.map((routine) => {
                return (
                  <div key={routine.id}>
                    <h3>{`${routine.name}`}</h3>
                    <p>{`${routine.description}`}</p>
                  </div>
                );
              })}
          </div>
        </main>
      )}
    </>
  );
}

export default App;
