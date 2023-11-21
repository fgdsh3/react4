import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import './sign-up.scss'
import { ApiService } from '../../services/api-service';

export const SignUp = () => {

  const apiService = new ApiService();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    username: yup.string().min(3).max(20).required(),
    password: yup.string().min(6).max(40).required(),
    repeatPassword: yup.string().oneOf([yup.ref("password"), ''], 'passwords must match').required('repeat password is required'),
    checkbox: yup.boolean().oneOf([true], 'this field must be chosen')
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data: any) => {
    const newObj = { username: data.username, email: data.email, password: data.password }
    apiService.createUser({ user: newObj })
    reset()
  }

  return (
    <form className='sign-up__form' onSubmit={handleSubmit(onSubmitHandler)}>
      <h4 className='sign-up__title'>Create new account</h4>
      <label>
        Username
        <input
          {...register("username")}
          name='username'
          placeholder='Username'
        />
        <p className='red'>{errors.username?.message}</p>
      </label>
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
          name="password"
          placeholder='Password'
        />
        <p className='red'>{errors.password?.message}</p>
      </label>
      <label>
        Repeat Password
        <input
          {...register("repeatPassword")}
          name="repeatPassword"
          placeholder='Password' />
        <p className='red'>{errors.repeatPassword?.message}</p>
      </label>
      <div className='sign-up__checkbox-container'>
        <label>
          <input
            {...register("checkbox")}
            className='sign-up__checkbox'
            type="checkbox" />
          I agree to the processing of my personal
          information
          <p className='red'>{errors.checkbox?.message}</p>
        </label>
      </div>
      <button className='sign-up__submit-btn'>Create</button>
      <span> Already have an account?<Link to='/sign-in'>Sign In</Link>.</span>
    </form>
  )
}