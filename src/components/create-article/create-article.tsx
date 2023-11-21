import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import './create-article.scss';
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { IData, addTag, deleteTag, fetchCreateArticle, updateTag } from "../../store/reducers/full-article-slice";
import { useNavigate } from "react-router-dom";


export const CreateArticle = () => {
  const { tags } = useAppSelector(state => state.fullArticle)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const tagSchema = yup.string().min(1).max(25)

  const schema = yup.object().shape({
    title: yup.string().min(1).max(150).required(),
    description: yup.string().min(1).max(150).required(),
    body: yup.string().min(10).max(1000).required(),
    tagList: yup.array().of(tagSchema).min(1).required(),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data: IData) => {
    dispatch(fetchCreateArticle({ article: data })).then(resp => {
      navigate(`/articles/${resp.payload.slug}`)
    })
  }

  const createTags = () => {
    return tags.map((tag, i) => (
      <div className="create-article__tagrow">
        <input className="create-article__tag"
          {...register(`tagList.${i}`)}
          key={i}
          value={tag}
          placeholder="Tag"
          onChange={e => {
            const value = e.target.value
            dispatch(updateTag({ i, value }))
          }} />
          {
            tags.length > 1 ?
          <button className="red-btn" onClick={() => dispatch(deleteTag(i))}>Delete</button>
          : null
          }
        <button className="blue-btn" onClick={() => dispatch(addTag())}>Add tag</button>
      </div>
    ))
  }

  return (
    <div className="create-article">
      <h4 className="create-article__title">Create new article</h4>
      <form className="create-article__form" onSubmit={handleSubmit(onSubmitHandler)}>
        <label>
          Title<br />
          <input
            {...register("title")}
            className="create-article__form-title"
            placeholder="Title" />
        </label>
        <label>
          Short description<br />
          <input
            {...register("description")}
            className="create-article__form-title"
            placeholder="Title" />
        </label>
        <label>
          Text<br />
          <textarea
            {...register("body")}
            className="create-article__form-text"
            placeholder="Text"
          />
        </label>
        <label className="create-article__tags">
          Tags
          {createTags()}
        </label>
        <button className="create-article__send">Send</button>
      </form>
    </div>
  )
}