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
    description: yup.string().required('short description is a requred field'),
    body: yup.string().required('text is a required field'),
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

  const onSubmitHandler = async (data: IFullArticleData) => {
    const resultAction = await dispatch(fetchCreateArticle({ article: data }));
    if (resultAction.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
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
          <button
            type="button"
            className="red-btn"
            onClick={() => dispatch(deleteTag(i))}
          >
            Delete
          </button>
        ) : null}
        <button
          type="button"
          className="blue-btn"
          onClick={() => dispatch(addTag())}
        >
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
          {serverErrors && serverErrors.title ? (
            <p className="red">{`title ${serverErrors?.title}`}</p>
          ) : null}
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
          {serverErrors && serverErrors.description ? (
            <p className="red">{`description ${serverErrors?.description}`}</p>
          ) : null}
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
          {serverErrors && serverErrors.body ? (
            <p className="red">{`text ${serverErrors?.body}`}</p>
          ) : null}
        </label>
        <label className="create-article__tags">
          Tags
          {createTags()}
          <p className="red">{clientErrors.tagList?.message}</p>
          {serverErrors && serverErrors.tagList ? (
            <p className="red">{`tags ${serverErrors?.tagList}`}</p>
          ) : null}
        </label>
        <button className="create-article__send">Send</button>
      </form>
    </div>
  );
};
