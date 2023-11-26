import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import React, { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<Props> = ({ children }) => {
  const { currUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currUser) {
      navigate('/sign-in');
    }
  }, []);

  return children;
};
