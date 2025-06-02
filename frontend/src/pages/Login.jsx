import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  // Basic validation
  if (!email || !password || (state === 'Sign Up' && !name)) {
    toast.error("All fields are required");
    return;
  }

  try {
    const payload = state === 'Sign Up'
      ? { name, email, password }
      : { email, password };

    const endpoint = `${backendUrl}/api/user/${state === 'Sign Up' ? 'signup' : 'login'}`;

    console.log("Sending to:", endpoint);
    console.log("Payload:", payload);

    const response = await axios.post(endpoint, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      toast.success(`${state === 'Sign Up' ? 'Account created' : 'Logged in'} successfully!`);
      navigate('/');
    } else {
      toast.error(response.data.message || `${state} failed`);
    }
  } catch (err) {
    const message = err.response?.data?.message || `${state} failed. Please try again.`;
    toast.error(message);
    console.error("Backend Error:", err.response?.data || err.message);
  }
};


  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p className='text-gray-500'>
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
        </p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type='submit'
          className='w-full py-2 rounded-md text-base text-white bg-blue-600 hover:bg-blue-700 transition-colors'
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <div className='text-sm'>
          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className='text-blue-600 underline cursor-pointer'
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className='text-blue-600 underline cursor-pointer'
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
