import './article-list-item.scss';
import noAvatar from '../../../img/no-avatar.jpg';
import HeartSvg from '../../../img/heart.svg';
import RedHeartSvg from '../../../img/red-heart.svg';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { getFullArticle } from '../../../store/reducers/full-article-slice';
import { Link, useNavigate } from 'react-router-dom';
import { formatTags } from '../../../helpers/format-tags';
import { ApiService } from '../../../services/api-service';
import { changeFavoritedArticleList } from '../../../store/reducers/article-list-slice';

interface ArticleListItemProps {
  slug: string;
  title: string;
  label: string;
  tagList: string[];
  createdAt: string;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
  /* updatedAt: string, */
  favorited: boolean;
  index: number;
}

export const ArticleListItem = (props: ArticleListItemProps) => {
  const {
    title,
    label,
    tagList,
    createdAt,
    author,
    favoritesCount,
    slug,
    favorited,
    index,
  } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currUser } = useAppSelector((state) => state.user);
  const apiService = new ApiService();

  return (
    <li className="article-list__item">
      <div className="article-list__item-top">
        <Link
          to={`/articles/${slug}`}
          onClick={() => dispatch(getFullArticle(slug))}
        >
          <h4 className="article-list__item-title">{title.trim()}</h4>
        </Link>
        <button
          className="article-list__item-likebtn"
          onClick={() => {
            if (!currUser) {
              navigate('/sign-in');
            } else if (favorited) {
              apiService.unfavoriteAnArticle(slug);
            } else {
              apiService.favoriteAnArticle(slug);
            }
            dispatch(changeFavoritedArticleList(index));
          }}
        >
          {favorited ? <RedHeartSvg alt="heart" /> : <HeartSvg alt="heart" />}
          {favoritesCount}
        </button>
      </div>
      <div className="article-list__item-author">
        <div className="article-list__item-authortext">
          <span className="article-list__item-authorname">
            {author.username}
          </span>
          <span className="article-list__item-date">
            {format(new Date(createdAt), 'PP')}
          </span>
        </div>
        <img
          className="article-list__item-avatar"
          src={author.image}
          onError={(e) => {
            e.currentTarget.src = noAvatar;
          }}
          alt="avatar"
        />
      </div>
      <div className="article-list__item-tagsrow">{formatTags(tagList)}</div>
      <p className="article-list__item-text">{label}</p>
    </li>
  );
};
