import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ApiService } from '../../services/api-service';
import './edit-profile.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { updateUser } from '../../store/reducers/user-slice';

export const EditProfile = () => {
  const { currUser } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const schema = yup.object().shape({
    email: yup.string().email(),
    username: yup.string()/* .min(3).max(20) */,
    password: yup.string(),
    image: yup.string(),
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
    dispatch(updateUser(data))
    reset()
  }

  return (
    <form className='edit-profile__form' onSubmit={handleSubmit(onSubmitHandler)}>
      <h4 className='edit-profile__title'>Edit Profile</h4>
      <label>
        Username<br />
        <input
          {...register("username")}
          defaultValue={currUser && currUser.username}
          autoComplete='username'
          placeholder='Username'
        />
        <p className='red'>{errors.username?.message}</p>
      </label>
      <label>
        Email address<br />
        <input
          {...register("email")}
          defaultValue={currUser && currUser.email}
          autoComplete='email'
          placeholder='Email address'
        />
        <p className='red'>{errors.email?.message}</p>
      </label>
      <label>
        New password<br />
        <input
          {...register("password")}
          autoComplete="password"
          placeholder='Password'
        />
        <p className='red'>{errors.password?.message}</p>
      </label>
      <label>
        Avatar image<br />
        <input
          {...register("image")}
          defaultValue={currUser && currUser.image}
          placeholder='Avatar' />
        <p className='red'>{errors.image?.message}</p>
      </label>
      <button className='edit-profile__submit-btn'>Save</button>
    </form>
  )
}