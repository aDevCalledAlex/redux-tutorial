import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { createSelector } from '@reduxjs/toolkit'

import { Spinner } from '../../components/Spinner'
import { selectUserById, selectUserMetaData } from '../users/usersSlice'
import { useGetPostsQuery } from '../api/apiSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector(state => selectUserById(state, userId))
  const userMetaData = useSelector(state => selectUserMetaData(state))
  const userData = {
    user,
    ...userMetaData
  }

  // Return a unique selector instance for this page so that
  // the filtered results are correctly memoized
  const selectPostsForUser = useMemo(() => createSelector(
    [result => result.data, (result, userId) => userId],
    (posts, userId) => posts?.filter(post => post.userId === userId) ?? []
  )
  , [])

  // Use the same posts query, but extract only part of its data
  const postData = useGetPostsQuery(undefined, {
    selectFromResult: result => ({
      // We can optionally include the other metadata fields from the result here
      ...result,
      // Include a field called `postsForUser` in the hook result object,
      // which will be a filtered list of posts
      postsForUser: selectPostsForUser(result, userId)
    })
  })

  // const postDataAll = useGetPostsQuery()
  // const { data = [] } = postDataAll
  // const postData = {
  //   ...postDataAll,
  //   postsForUser: data.filter(post => post.userId === userId) ?? []
  // }

  const content = getPageContent({
    userData,
    postData
  })

  return (
    <section>
      {content}
    </section>
  )
}

const getPageContent = ({ userData, postData }) => {
  const isFetching = userData.isFetching || postData?.isFetching
  const { isError, error, user } = userData
  // debugger

  if (isFetching) return <Spinner text="Loading..." />
  if (isError) return (
    <>
      <h2>Unable to load users. Try again later.</h2>
      <h3>Status: {error.status}</h3>
    </>
  )
  if (!user) return <h2>User not found!</h2>

  // This needs to get memoized? Isn't this simpler than and just as effective as selectFromResult?
  // const { data: posts} = useGetPostsQuery()
  // const userPosts = posts?.filter(post => post.user === userId) ?? []

  const postTitles = postData?.postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  )) ?? []

  return (
    <>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </>
  )
}