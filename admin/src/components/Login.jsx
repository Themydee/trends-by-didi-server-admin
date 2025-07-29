import React from 'react'
import logo from '../assets/loginImg.png'

const Login = () => {
    const onSubmitHandler =  async (e) => {

    }
  return (
    <div>
        <div>
            <div>
                <img src={logo} alt="" />
            </div>

            <div>
                <form action="" onSubmit={onSubmitHandler}>
                    <div>
                        <h3>Login</h3>
                    </div>

                    <div className="w-full">
                        <label htmlFor="email"></label>
                        <input type="email" placeholder="email" className="w-full px-3 ring-1 ring-slate-900/10 bg-primary mt-1"  required/>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login