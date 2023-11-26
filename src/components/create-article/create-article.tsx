import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import './create-article.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  IFullArticleData,
  addTag,
  deleteTag,
  fetchCreateArticle,
  updateTag,
} from '../../store/reducers/full-article-slice';
import { useNavigate } from 'react-router-dom';

export const CreateArticle = () => {
  const { tags } = useAppSelector((state) => state.fullArticle);
  const { serverErrors, currUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    body: yup.string().required(),
    tagList: yup.array().of(yup.string()),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const clientErrors = errors;

  const onSubmitHandler = (data: IFullArticleData) => {
    dispatch(fetchCreateArticle({ article: data })).then((resp) => {
      navigate(`/articles/${resp.payload.slug}`);
    });
  };

  const createTags = () => {
    return tags.map((tag, i) => (
      <div className="create-article__tagrow" key={`${i * Math.random()}`}>
        <input
          className="create-article__tag"
          {...register(`tagList.${i}`)}
          key={`${i * Math.random() + 1}`}
          value={tag}
          placeholder="Tag"
          onChange={(e) => {
            const { value } = e.target;
            dispatch(updateTag({ i, value }));
          }}
        />
        {tags.length > 1 ? (
          <button className="red-btn" onClick={() => dispatch(deleteTag(i))}>
            Delete
          </button>
        ) : null}
        <button className="blue-btn" onClick={() => dispatch(addTag())}>
          Add tag
        </button>
      </div>
    ));
  };

  if (!currUser) {
    navigate('/sign-in');
  }

  return (
    <div className="create-article">
      <h4 className="create-article__title">Create new article</h4>
      <form
        className="create-article__form"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <label>
          Title
          <br />
          <input
            {...register('title')}
            className="create-article__form-title"
            placeholder="Title"
          />
          <p className="red">{clientErrors.title?.message}</p>
          {serverErrors.title && (
            <p className="red">{`email ${serverErrors.title}`}</p>
          )}
        </label>
        <label>
          Short description
          <br />
          <input
            {...register('description')}
            className="create-article__form-title"
            placeholder="Title"
          />
          <p className="red">{clientErrors.description?.message}</p>
          {serverErrors.description && (
            <p className="red">{`email ${serverErrors.description}`}</p>
          )}
        </label>
        <label>
          Text
          <br />
          <textarea
            {...register('body')}
            className="create-article__form-text"
            placeholder="Text"
          />
          <p className="red">{clientErrors.body?.message}</p>
          {serverErrors.body && (
            <p className="red">{`email ${serverErrors.body}`}</p>
          )}
        </label>
        <label className="create-article__tags">
          Tags
          {createTags()}
          <p className="red">{clientErrors.tagList?.message}</p>
          {serverErrors.tagList && (
            <p className="red">{`email ${serverErrors.tagList}`}</p>
          )}
        </label>
        <button className="create-article__send">Send</button>
      </form>
    </div>
  );
};
