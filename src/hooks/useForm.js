import {
    useContext,
    useState
} from "react"
import {
    AuthContext
} from "../context/authContext"

export function useForm(initialFormState, onSubmitCallback, action) {
    const [formData, setFormData] = useState(initialFormState)

    const [result, setResult] = useState('')

    const {
        login
    } = useContext(AuthContext)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const responseMessage = await onSubmitCallback(formData, action)
            setResult(responseMessage)
            login(
                responseMessage.access_token,
                responseMessage.user
            )
            //pongo el formulario vacio
            setFormData(initialFormState)
        } catch (error) {
            setResult(error)
            //hago focus al primer elemento del formulario
            e.target.elements[0].focus();
        } finally {
            //muestro el mensaje durante 5 segundos
            setTimeout(() => {
                setResult('');
            }, 5000);
        }

    }

    return ({
        formData,
        result,
        handleChange,
        handleSubmit
    })
}