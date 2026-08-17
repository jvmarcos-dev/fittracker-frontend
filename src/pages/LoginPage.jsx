import { useNavigate } from "react-router-dom";
import { authUser } from "../services/authService";
import { useContext, useEffect, useState } from "react";
import { useForm } from "../hooks/useForm";
import { AuthContext } from "../context/authContext";
import { ShowAuth } from "../components/Auth";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(false);
  const { formData, result, handleChange, handleSubmit } = useForm(
    initialFormState,
    authUser,
    showLogin ? "login" : "register",
  );

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  //si el usuario ya está autenticado, lo enviamos al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <ShowAuth
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        result={result.message}
        showLogin={showLogin}
        handleLoginClick={() => setShowLogin(!showLogin)}
      ></ShowAuth>
    </div>
  );
}
