import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { IUserObj } from '../../services/api-service';
import './edit-profile.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { clearServerErrors, updateUser } from '../../store/reducers/user-slice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const EditProfile = () => {
  const { currUser, serverErrors } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).max(40).notRequired(),
    image: yup.string().url(),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = async (data: IUserObj) => {
    dispatch(clearServerErrors());
    const resultAction = await dispatch(updateUser(data));
    if (resultAction.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearServerErrors());
    };
  }, []);

  if (!currUser) {
    navigate('/sign-in');
  }

  return (
    <form
      className="edit-profile__form"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <h4 className="edit-profile__title">Edit Profile</h4>
      <label>
        Username
        <br />
        <input
          {...register('username')}
          defaultValue={currUser && currUser.username}
          autoComplete="username"
          placeholder="Username"
        />
        <p className="red">{errors.username?.message}</p>
        {serverErrors && serverErrors.username ? (
          <p className="red">{`username ${serverErrors?.username}`}</p>
        ) : null}
      </label>
      <label>
        Email address
        <br />
        <input
          {...register('email')}
          defaultValue={currUser && currUser.email}
          autoComplete="email"
          placeholder="Email address"
        />
        <p className="red">{errors.email?.message}</p>
        {serverErrors && serverErrors.email ? (
          <p className="red">{`email ${serverErrors?.email}`}</p>
        ) : null}
      </label>
      <label>
        New password
        <br />
        <input
          {...register('password')}
          autoComplete="new-password"
          placeholder="Password"
        />
        <p className="red">{errors.password?.message}</p>
        {serverErrors && serverErrors.password ? (
          <p className="red">{`password ${serverErrors?.password}`}</p>
        ) : null}
      </label>
      <label>
        Avatar image
        <br />
        <input
          {...register('image')}
          defaultValue={currUser && currUser.image}
          placeholder="Avatar"
        />
        <p className="red">{errors.image?.message}</p>
        {serverErrors && serverErrors.image ? (
          <p className="red">{`image ${serverErrors?.image}`}</p>
        ) : null}
      </label>
      <button className="edit-profile__submit-btn">Save</button>
    </form>
  );
};
