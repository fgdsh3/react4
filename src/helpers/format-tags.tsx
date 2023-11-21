export const formatTags = (tagArr: string[]) => {
  let index = 329472374729

  return tagArr.filter(tag => tag.length > 0).map(tag => (
    <span className="article-list__item-tag" key={index++}>{tag}</span>
  ))
}