import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ApiService } from '../../services/api-service';
import './sign-in.scss';
import { login } from '../../store/reducers/user-slice';
import { useAppDispatch } from '../../hooks/redux';

export const SignIn = () => {

  const dispatch = useAppDispatch()
  const apiService = new ApiService();

  const signInSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(40).required(),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const onSubmitHandler = (data: any) => {
    dispatch(login({ user: data }))
    reset()
  }

  return (
    <form className='sign-in__form' onSubmit={handleSubmit(onSubmitHandler)}>
      <h4 className='sign-in__title'>Sign in</h4>
      <label>
        Email address
        <input
          {...register("email")}
          name='email'
          placeholder='Email address'
        />
        <p className='red'>{errors.email?.message}</p>
      </label>
      <label>
        Password
        <input
          {...register("password")}
          name='password'
          placeholder='Password' />
        <p className='red'>{errors.password?.message}</p>
      </label>
      <button className='sign-in__submit-btn'>Create</button>
      <span>Don’t have an account?<Link to='/sign-up'>Sign up</Link>.</span>
    </form>
  )
}