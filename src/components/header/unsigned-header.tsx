import { Link } from "react-router-dom";
import './header.scss';

export const UnsignedHeader = () => {
  return (
    <header className="header">
          <Link to='/'>Realworld Blog</Link>
      <div className="header__right">
          <Link to='/sign-in'>Sign In</Link>
          <Link to='/sign-up'>Sign Up</Link>
      </div>
    </header>
  )
}
