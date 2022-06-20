import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { createSelector } from '@reduxjs/toolkit'

import { Spinner } from '../../components/Spinner'
import { useGetPostsQuery } from '../api/apiSlice'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params
  // const { data: post, isFetching, isError, error } = useGetPostQuery(postId)

  const selectSinglePost = useMemo(() => createSelector(
    [result => result.data, (result, postId) => postId],
    (posts, postId) => posts?.find(post => post.id === postId)
  )
  , [])

  const {
    post,
    isFetching, isError, error
  } = useGetPostsQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      post: selectSinglePost(result, postId)
    })
  })

  const content = getPageContent({ post, isFetching, isError, error })

  return (
    <section>
      {content}
    </section>
  )
}

const getPageContent = ({
  post, 
  isFetching, 
  isError,
  // error
}) => {
  if (isFetching) return <Spinner text="Loading..." />
  if (isError || !post) return (
    <>
      <h2>Post not found!</h2>
      {/* Status: {error.status} */}
    </>
  )

  return (
    <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <PostAuthor userId={post.userId} />
        <ReactionButtons postId={post.id} postReactions={post.reactions} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
  )
}