const API_URL = 'http://localhost:8000/api'

export const authUser = async (userData, action) => {
    try {
        const response = await fetch(`${API_URL}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userData),
        })

        const json = await response.json()

        if (!response.ok) {
            throw new Error(json.message || 'Error en el servidor')
        }

        return json
    } catch (e) {
        throw new Error(e, {
            cause: e,
        })
    }
}