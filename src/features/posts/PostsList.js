import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'
import { useGetPostsQuery } from '../api/apiSlice'

export const PostsList = () => {
  const {
    data: posts = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useGetPostsQuery()

  const memoizedSortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    // Sort posts in descending chronological order
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  const content = getPageContent({
    posts: memoizedSortedPosts,
    isLoading,
    isFetching,
    isError,
    error
  })
  
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}

const PostExcerpt = ({ post }) => (
  <article className="post-excerpt" key={post.id}>
    <h3>{post.title}</h3>
    <div>
      <PostAuthor userId={post.userId} />
      <TimeAgo timestamp={post.date} />
    </div>
    <p className="post-content">{post.content.substring(0, 100)}</p>

    <ReactionButtons postId={post.id} postReactions={post.reactions} />
    <Link to={`/posts/${post.id}`} className="button muted-button">
      View Post
    </Link>
  </article>
)

const getPageContent = ({
  posts,
  isLoading,
  isFetching,
  isError,
  error
}) => {
  if (isLoading) return <Spinner text="Loading..." /> 
  if (isError) return <div>{error}</div>
  
  const renderedPosts = posts.map(post => (
    <PostExcerpt key={post.id} post={post} />
  )) 

  const containerClassname = classnames('posts-container', {
    disabled: isFetching
  })

  return (
    <div className={containerClassname}>
      {renderedPosts}
    </div>
  )
}
