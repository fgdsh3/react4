import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import './sign-up.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { clearServerErrors, createUser } from '../../store/reducers/user-slice';
import { useEffect } from 'react';

export interface ISignUpData {
  username: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { serverErrors } = useAppSelector((state) => state.user);

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    username: yup.string().min(3).max(20).required(),
    password: yup.string().min(6).max(40).required(),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref('password'), ''], 'passwords must match')
      .required('repeat password is required'),
    checkbox: yup.boolean().oneOf([true], 'this field must be chosen'),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const clientErrors = errors;

  const onSubmitHandler = async (data: ISignUpData) => {
    dispatch(clearServerErrors());
    await dispatch(createUser({ user: data }));
    if (Object.keys(serverErrors).length === 0) {
      navigate('/sign-in');
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearServerErrors());
    };
  }, []);

  return (
    <form className="sign-up__form" onSubmit={handleSubmit(onSubmitHandler)}>
      <h4 className="sign-up__title">Create new account</h4>
      <label>
        Username
        <input
          {...register('username')}
          name="username"
          placeholder="Username"
        />
        <p className="red">{clientErrors.username?.message}</p>
        {serverErrors && serverErrors.username ? (
          <p className="red">{`username ${serverErrors?.username}`}</p>
        ) : null}
      </label>
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
        <input {...register('password')} placeholder="Password" />
        <p className="red">{clientErrors.password?.message}</p>
        {serverErrors && serverErrors.password ? (
          <p className="red">{`password ${serverErrors?.password}`}</p>
        ) : null}
      </label>
      <label>
        Repeat Password
        <input
          {...register('repeatPassword')}
          autoComplete="off"
          placeholder="Password"
        />
        <p className="red">{clientErrors.repeatPassword?.message}</p>
      </label>
      <div className="sign-up__checkbox-container">
        <label>
          <input
            className="sign-up__checkbox"
            {...register('checkbox')}
            autoComplete="off"
            type="checkbox"
          />
          I agree to the processing of my personal information
          <p className="red">{clientErrors.checkbox?.message}</p>
        </label>
      </div>
      <button className="sign-up__submit-btn">Create</button>
      <span>
        {' '}
        Already have an account?<Link to="/sign-in"> Sign In</Link>.
      </span>
      <p className="red">
        {serverErrors && serverErrors['email or password']
          ? `email or password ${serverErrors['email or password']}`
          : ''}
      </p>
    </form>
  );
};
