import { FC } from 'react';
import './app.scss';
import { UnsignedHeader } from '../header/unsigned-header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ArticleList } from '../article-list/article-list';
import { SignUp } from '../sign-up/sign-up';
import { useAppSelector } from '../../hooks/redux';
import { SignIn } from '../sign-in/sign-in';
import { SignedHeader } from '../header/signed-header';
import { FullArticle } from '../full-article/full-article';
import { NotFoundPage } from '../not-found-page/not-found-page';
import { CreateEditArticle } from '../create-edit-article/create-edit-article';
import { EditProfile } from '../edit-profile/edit-profile';
import { RequireAuth } from '../require-auth/require-auth';

export const App: FC = () => {
  const { currUser } = useAppSelector((state) => state.user);

  return (
    <BrowserRouter>
      <div className="app">
        {currUser ? <SignedHeader /> : <UnsignedHeader />}
        <div className="container">
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/articles/:slug" element={<FullArticle />} />
            <Route
              path="/articles/:slug/edit"
              element={
                <RequireAuth>
                  <CreateEditArticle key="edit" isCreateArticle={false} />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <EditProfile />
                </RequireAuth>
              }
            />
            <Route
              path="/new-article"
              element={
                <RequireAuth>
                  <CreateEditArticle key="create" isCreateArticle />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
