function Register({handleSubmit, handleChange, formData, result, handleLoginClick}) {
  return (
    <>
    <p>Formulario de registro</p>
    {result && <p>{result}</p>}
      <form className='form' onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} type='text' placeholder='Introduce tu nombre'></input>
        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder='Introduce tu email'></input>
        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder='Introduce la contraseña'></input>
        <input name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} type="password" placeholder='Introduce la contraseña de nuevo'></input>
        <button type='submit'>Registrarse</button>
        <p>Prefiero <a onClick={handleLoginClick}>iniciar sesión</a></p>
      </form>
    </>
  )
}

function Login({handleSubmit, handleChange, formData, result, handleLoginClick}) {
  return (
    <>
    <p>Iniciar sesión</p>
    {result && <p>{result}</p>}
      <form className='form' onSubmit={handleSubmit}>
        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder='Introduce tu email'></input>
        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder='Introduce la contraseña'></input>
        <button type='submit'>Iniciar sesión</button>
        <p>Prefiero <a onClick={handleLoginClick}>Registrarme</a></p>
      </form>
    </>
  )
}

export function ShowAuth({handleSubmit, handleChange, formData, result, showLogin, handleLoginClick}){
    return showLogin ? <Login handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} result={result} handleLoginClick={handleLoginClick}></Login> : <Register handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} result={result} handleLoginClick={handleLoginClick}></Register>
}