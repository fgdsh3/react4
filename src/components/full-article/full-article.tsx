import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import './full-article.scss';
import { format } from 'date-fns';
import HeartSvg from '../../img/heart.svg';
import RedHeartSvg from '../../img/red-heart.svg';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import {
  changeFavoritedFullArticle,
  getFullArticle,
} from '../../store/reducers/full-article-slice';
import { formatTags } from '../../helpers/format-tags';
import { ApiService } from '../../services/api-service';
import Markdown from 'react-markdown';

export const FullArticle = () => {
  const { fullArticle, isLoading } = useAppSelector(
    (state) => state.fullArticle,
  );
  const { currUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const apiService = new ApiService();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getFullArticle(slug));
  }, [slug]);

  if (isLoading) {
    return <span className="loader" />;
  }

  if (fullArticle === '') {
    return null;
  }

  const {
    title,
    favoritesCount,
    author,
    createdAt,
    description,
    body,
    tagList,
    favorited,
  } = fullArticle;

  return (
    <article className="full-article">
      <div className="full-article__top">
        <h4 className="full-article__title">{title}</h4>
        <button
          className="full-article__item-likebtn"
          onClick={() => {
            if (!currUser) {
              navigate('/sign-in');
            } else if (favorited) {
              apiService.unfavoriteAnArticle(slug);
            } else {
              apiService.favoriteAnArticle(slug);
            }
            dispatch(changeFavoritedFullArticle());
          }}
        >
          {favorited ? <RedHeartSvg alt="heart" /> : <HeartSvg alt="heart" />}
          {favoritesCount}
        </button>
      </div>
      <div className="full-article__author">
        <div className="full-article__authortext">
          <span className="full-article__authorname">{author.username}</span>
          <span className="full-article__date">
            {format(new Date(createdAt), 'PP')}
          </span>
        </div>
        <img className="full-article__avatar" src={author.image} alt="avatar" />
      </div>
      {currUser && currUser.username === fullArticle.author.username ? (
        <div className="edit-article__btns">
          <button
            className="red-btn"
            onClick={() => {
              apiService.deleteArticle(slug);
              navigate('/');
            }}
          >
            Delete
          </button>
          <button
            className="green-btn"
            onClick={() => {
              navigate('edit');
            }}
          >
            Edit
          </button>
        </div>
      ) : null}
      <div className="full-article__tagsrow">{formatTags(tagList)}</div>
      <p className="full-article__description">{description}</p>
      <div className="full-article__text">
        <Markdown>{body}</Markdown>
      </div>
    </article>
  );
};
