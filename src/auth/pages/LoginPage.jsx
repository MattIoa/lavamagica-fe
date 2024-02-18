import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useForm } from '../../hooks/useForm';
import './LoginPage.css';


const loginFormFields = {
    loginEmail:    '',
    loginPassword: '',
}

const registerFormFields = {
    registerName:      '',
    registerEmail:     '',
    registerPassword:  '',
    registerPassword2: '',
}

export const LoginPage = () => {


    const { startLogin, errorMessage, startRegister } = useAuthStore();
    
    const { loginEmail, loginPassword, onInputChange:onLoginInputChange } = useForm( loginFormFields );
    const { registerEmail, registerName, registerPassword, registerPassword2, onInputChange:onRegisterInputChange } = useForm( registerFormFields );
   
   const loginSubmit = ( event ) => {
    event.preventDefault();
    //console.log(loginEmail,loginPassword);
    startLogin({ email: loginEmail, password: loginPassword });
}


const registerSubmit = ( event ) => {
    event.preventDefault();
    if ( registerPassword !== registerPassword2 ) {
        Swal.fire('Error en registro', 'Contraseñas no son iguales', 'error');
        return;
    }
   // console.log(registerName,registerEmail,registerPassword,registerPassword2);
    startRegister({ name: registerName, email: registerEmail, password: registerPassword });
}

useEffect(() => {
    if ( errorMessage !== undefined ) {
      Swal.fire('Errore di autenticazione', errorMessage, 'error');
    }    
  }, [errorMessage])
   
   return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Login</h3>
                    <form onSubmit={ loginSubmit }>
                        <div className="form-group mb-2">
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Email"
                                name="loginEmail"
                                value={ loginEmail }
                                onChange={ onLoginInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                name="loginPassword"
                                value={ loginPassword }
                                onChange={ onLoginInputChange }
                            />
                        </div>
                        <div className="d-grid gap-2 login-button">
                            <input 
                                type="submit"
                                className="btnSubmit"
                                value="Login" 
                            />
                        </div>
                    </form>
                </div>

                <div className="col-md-6 login-form-2">
                    <h3>Registrazione</h3>
                    <form onSubmit={ registerSubmit }>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nome"
                                name="registerName"
                                value={ registerName }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                name="registerEmail"
                                value={ registerEmail }
                                onChange={ onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Passoword"
                                name="registerPassword"
                                value={ registerPassword }
                                onChange={ onRegisterInputChange }
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Conferma Password"
                                name="registerPassword2"
                                value={ registerPassword2 }
                                onChange={ onRegisterInputChange }
                            />
                        </div>

                        <div className="d-grid gap-2 login-button">
                            <input 
                                type="submit" 
                                className="btnSubmit" 
                                value="Crea Account" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}