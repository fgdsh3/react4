import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import './sign-in.scss';
import { clearServerErrors, login } from '../../store/reducers/user-slice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

export interface ISignInData {
  email: string;
  password: string;
}

export const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { serverErrors } = useAppSelector((state) => state.user);

  const signInSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(40).required(),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(signInSchema),
  });

  const clientErrors = errors;

  const onSubmitHandler = async (data: ISignInData) => {
    dispatch(clearServerErrors());
    const resultAction = await dispatch(login({ user: data }));
    if (resultAction.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearServerErrors());
    };
  }, []);

  return (
    <form className="sign-in__form" onSubmit={handleSubmit(onSubmitHandler)}>
      <h4 className="sign-in__title">Sign in</h4>
      <label>
        Email address
        <input
          {...register('email')}
          name="email"
          placeholder="Email address"
        />
        <p className="red">{clientErrors.email?.message}</p>
        {serverErrors && serverErrors.email ? (
          <p className="red">{`email ${serverErrors?.email}`}</p>
        ) : null}
      </label>
      <label>
        Password
        <input
          {...register('password')}
          autoComplete="off"
          placeholder="Password"
        />
        <p className="red">{clientErrors.password?.message}</p>
        {serverErrors && serverErrors.password ? (
          <p className="red">{`password ${serverErrors?.password}`}</p>
        ) : null}
      </label>
      <button className="sign-in__submit-btn">Login</button>
      <span>
        Don’t have an account?<Link to="/sign-up"> Sign up</Link>.
      </span>
      <p className="red">
        {serverErrors && serverErrors['email or password']
          ? `email or password ${serverErrors['email or password']}`
          : ''}
      </p>
    </form>
  );
};
