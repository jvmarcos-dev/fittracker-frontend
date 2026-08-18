import {
    useState
} from "react"

export function useForm(initialFormState, onSubmitCallback) {
    const [formData, setFormData] = useState(initialFormState)
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const responseMessage = await onSubmitCallback(formData)
            setResult(responseMessage)
            //pongo el formulario vacio
            setFormData(initialFormState)
        } catch (error) {
            setResult(error)
            //hago focus al primer elemento del formulario
            e.target.elements[0].focus();
        } finally {
            setLoading(false)
            //muestro el mensaje durante 5 segundos
            setTimeout(() => {
                setResult('');
            }, 5000);
        }
    }

    const resetForm = () => setFormData(initialFormState)

    return ({
        formData,
        result,
        loading,
        handleChange,
        handleSubmit,
        resetForm,
    })
}