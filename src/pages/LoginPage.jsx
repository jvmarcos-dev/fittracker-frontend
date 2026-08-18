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

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleAuth = async (data) => {
    const res = await authUser(data, showLogin ? "login" : "register");
    login(res.access_token, res.user);
    navigate("/dashboard");
  };

  const { formData, result, handleChange, handleSubmit } = useForm(
    initialFormState,
    handleAuth,
  );

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
