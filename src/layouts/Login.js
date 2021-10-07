import {useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import Axios from "axios";
import {setRefresh, setToken} from "../helpers/auth";

const shcema = yup.object().shape({
  email: yup.string().required("Este campo no puede estar vacio"),
  password: yup.string().required("Este campo no puede estar vacio"),
});

export default function Login() {
  const [error, setError] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(shcema),
  });

  async function onSubmit(data) {
    try {
      const response = await Axios.post('/api/token', data);
      if (response.status === 200) {
        setToken(response.data.access);
        setRefresh(response.data.refresh);
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    } catch (err) {
      const {data} = err.response;
      if (err.response.status === 400) {
        if (data.detail.code === 'invalid_email') {
          setError('Email Incorrecto');
        } else if (data.detail.code === 'invalid_password') {
          setError('Contraseña Incorrecta');
        } else if (data.detail.code === 'invalid_user') {
          setError('Usuario Inhabilitado');
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 lg:px-8 sm:px-6">
      <div className="max-w-md w-full">
        {/*<img className="mx-auto h-24 w-auto" src={logo} alt="logozentag" />*/}
        <h2 className="mt-6 text-center text-4xl leading-9 font-medium text-gray-700">Iniciar sesión</h2>
        {error && (
          <div className="flex justify-center items-center my-4">
            <p
              className="flex-1 text-center text-xs font-semibold rounded-sm text-red-800 border border-red-500 py-2 bg-red-600 bg-opacity-20">
              {error}
            </p>
          </div>
        )}
        <form className="my-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Usuario"
              className="input input-blue"
              {...register('email')}
            />
            <p className="text-red-600 font-light text-xs">{errors.email?.message}</p>
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Contraseña"
              className="input input-blue"
              {...register('password')}
            />
            <p className="text-red-600 font-light text-xs">{errors.password?.message}</p>
          </div>
          <div className="my-3 flex items-center justify-between p-1">
            <label className="inline-flex items-center text-sm leading-5 cursor-pointer">
              <input
                type="checkbox"
                className="rounded-sm h-4 w-4 text-orange-800 focus:ring-0 focus:border-orange-800 cursor-pointer"
                onClick={() => setShowPwd(!showPwd)}
              />
              <span className="ml-2 text-gray-700">Mostrar contraseña</span>
            </label>
          </div>
          <button type="submit" className="btn btn-blue">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
}