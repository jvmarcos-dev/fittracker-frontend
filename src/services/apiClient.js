// Configuración base (fetch/headers/token)

const API_URL = 'http://localhost:8000/api'

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    //configuracion de los headers
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //en caso de tener token lo añado
        ...(token ? {
            'Authorization': `Bearer ${token}`
        } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    const data = await response.json().catch(() => null);

    if(!response.ok){
        throw new Error(data?.message || 'Error en la petición')
    }

    return data;
}