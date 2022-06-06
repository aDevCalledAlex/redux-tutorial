import React from 'react'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { useGetPostQuery } from '../api/apiSlice'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

const getPageContent = ({
  post, 
  isFetching, 
  isError,
  error
}) => {
  if (isFetching) return <Spinner text="Loading..." />
  if (isError) return (
    <>
      <h2>Post not found!</h2>
      {error}
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

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params
  const { data: post, isFetching, isError, error } = useGetPostQuery(postId)
  const content = getPageContent({ post, isFetching, isError, error })

  return (
    <section>
      {content}
    </section>
  )
}