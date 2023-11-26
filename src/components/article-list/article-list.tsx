import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  changeCurrPage,
  fetchArticleList,
} from '../../store/reducers/article-list-slice';
import { ArticleListItem } from './article-list-item/article-list-item';
import { Pagination } from 'antd';
import './article-list.scss';
import { useEffect } from 'react';
import { IFullArticleObj } from '../../store/reducers/full-article-slice';

export const ArticleList = () => {
  const { articleList, currPage, totalPages, isLoading } = useAppSelector(
    (state) => state.articleList,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticleList(currPage));
  }, [currPage, fetchArticleList]);

  const createArticles = (articleArr: IFullArticleObj[]) => {
    return articleArr.map((articleItemObj, index) => {
      const {
        slug,
        title,
        description,
        tagList,
        createdAt,
        author,
        favoritesCount,
        favorited,
      } = articleItemObj;
      return (
        <ArticleListItem
          slug={slug}
          key={slug}
          title={title}
          label={description}
          tagList={tagList}
          createdAt={createdAt}
          author={author}
          favoritesCount={favoritesCount}
          favorited={favorited}
          index={index}
        />
      );
    });
  };

  return (
    <ul className="article-list">
      {articleList.length === 0 && isLoading && <span className="loader" />}
      {createArticles(articleList)}
      <Pagination
        pageSize={1}
        current={currPage}
        total={totalPages}
        onChange={(num) => dispatch(changeCurrPage(num))}
      />
    </ul>
  );
};
