import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { useNavigate } from "react-router-dom"
import { IData, addTag, deleteTag, fetchEditArticle, updateTag } from "../../store/reducers/full-article-slice"

export const ArticleEdit = () => {
  const { tags, fullArticle } = useAppSelector(state => state.fullArticle)
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

  if (!fullArticle) {
    return null
  }

  const onSubmitHandler = (data: IData) => {
    dispatch(fetchEditArticle({ article: data, slug: fullArticle.slug },)).then(resp => {
      navigate(`/articles/${resp.payload.slug}`)
    })
  }

  const createTags = () => {
    return tags.map((tag, i) => (
      <div className="create-article__tagrow">
        <input className="create-article__tag"
          {...register(`tagList.${i}`)}
          key={i}
          defaultValue={tag}
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

  if (!fullArticle) {
    return null
  }

  return (
    <div className="create-article">
      <h4 className="create-article__title">Edit article</h4>
      <form className="create-article__form" onSubmit={handleSubmit(onSubmitHandler)}>
        <label>
          Title<br />
          <input
            {...register("title")}
            defaultValue={fullArticle.title}
            className="create-article__form-title"
            placeholder="Title" />
        </label>
        <label>
          Short description<br />
          <input
            {...register("description")}
            defaultValue={fullArticle.description}
            className="create-article__form-title"
            placeholder="Title" />
        </label>
        <label>
          Text<br />
          <textarea
            {...register("body")}
            defaultValue={fullArticle.body}
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
