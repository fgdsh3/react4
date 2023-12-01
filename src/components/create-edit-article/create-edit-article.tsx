import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import './create-edit-article.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  IFullArticleData,
  addTag,
  changeTagsArr,
  clearTags,
  deleteTag,
  fetchCreateArticle,
  fetchEditArticle,
  updateTag,
} from '../../store/reducers/full-article-slice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const CreateEditArticle = ({
  isCreateArticle,
}: {
  isCreateArticle: boolean;
}) => {
  const { tags, fullArticle } = useAppSelector((state) => state.fullArticle);
  const { serverErrors, currUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCreateArticle && fullArticle && fullArticle.tagList) {
      dispatch(changeTagsArr(fullArticle.tagList));
    }
    return () => {
      dispatch(clearTags());
    };
  }, []);

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

  const createTags = () => {
    return tags.map((tag, i) => {
      return (
        <div className="create-edit-article__tagrow" key={i}>
          <input
            className="create-edit-article__tag"
            {...register(`tagList.${i}`)}
            key={i}
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
      );
    });
  };

  if (!currUser) {
    navigate('/sign-in');
  }

  const onSubmitHandler = async (data: IFullArticleData) => {
    if (isCreateArticle) {
      const resultAction = await dispatch(
        fetchCreateArticle({ article: data }),
      );
      if (resultAction.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    } else if (fullArticle) {
      const resultAction = await dispatch(
        fetchEditArticle({ article: data, slug: fullArticle.slug }),
      );
      if (resultAction.meta.requestStatus === 'fulfilled') {
        navigate(`/articles/${resultAction.payload.slug}`);
      }
    }
  };

  return (
    <div className="create-edit-article">
      <h4 className="create-edit-article__title">
        {isCreateArticle ? 'Create new article' : 'Edit article'}
      </h4>
      <form
        className="create-edit-article__form"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <label>
          Title
          <br />
          <input
            {...register('title')}
            className="create-edit-article__form-title"
            defaultValue={
              isCreateArticle ? '' : fullArticle && fullArticle.title
            }
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
            className="create-edit-article__form-title"
            defaultValue={
              isCreateArticle ? '' : fullArticle && fullArticle.description
            }
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
            className="create-edit-article__form-text"
            defaultValue={
              isCreateArticle ? '' : fullArticle && fullArticle.body
            }
            placeholder="Text"
          />
          <p className="red">{clientErrors.body?.message}</p>
          {serverErrors && serverErrors.body ? (
            <p className="red">{`text ${serverErrors?.body}`}</p>
          ) : null}
        </label>
        <label className="create-edit-article__tags">
          Tags
          {createTags()}
          <p className="red">{clientErrors.tagList?.message}</p>
          {serverErrors && serverErrors.tagList ? (
            <p className="red">{`tags ${serverErrors?.tagList}`}</p>
          ) : null}
        </label>
        <button className="create-edit-article__send">Send</button>
      </form>
    </div>
  );
};
