import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { 
  fetchPosts,
  selectPostIds,
  selectPostById 
} from './postsSlice'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'

const PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId))

  return (
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
}

const getPostsListContent = ({ postIds, postStatus, error }) => {
  if (postStatus === 'loading') return ( <Spinner text="Loading..." /> )
  if (postStatus === 'failed') return ( <div>{error}</div> )
  
  return ( 
    postIds.map(postId => (
      <PostExcerpt key={postId} postId={postId} />
    )) 
  )
}

export const PostsList = () => {
  const dispatch = useDispatch()
  const orderedPostIds = useSelector(selectPostIds)
  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if (postStatus !== 'idle') return
    
    dispatch(fetchPosts())
  }, [postStatus, dispatch])

  const content = getPostsListContent({
    postIds: orderedPostIds, 
    postStatus,
    error
  })
  
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}