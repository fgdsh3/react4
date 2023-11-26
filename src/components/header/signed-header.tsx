import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logOut } from '../../store/reducers/user-slice';
import noAvatar from '../../img/no-avatar.jpg';

export const SignedHeader = () => {
  const { currUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <header className="header signed-header">
      <Link to="/">Realworld Blog</Link>
      <div className="header__right">
        <Link className="green-btn" to="/new-article">
          Create article
        </Link>
        <Link className="header__profile" to="/profile">
          {currUser && <span>{currUser.username}</span>}
          <img
            className="header__avatar"
            src={currUser && currUser.image ? currUser.image : noAvatar}
            alt="avatar"
          />
        </Link>
        <button
          className="black-btn header__logout"
          onClick={() => dispatch(logOut())}
        >
          Log out
        </button>
      </div>
    </header>
  );
};
