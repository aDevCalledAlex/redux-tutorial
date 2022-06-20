import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { selectAllUsers, selectUsersResult } from './usersSlice'

export const UsersList = () => {
  const users = useSelector(selectAllUsers)
  const usersMetadata = useSelector(selectUsersResult)
  const userData = {
    users,
    ...usersMetadata
  }
  

  const content = getPageContent(userData)

  return (
    <section>
      <h2>Users</h2>
      {content}
      
    </section>
  )
}

const getPageContent = ({ users, isLoading, isError, error }) => {
  if (isLoading) return <Spinner text="Loading..." />
  if (isError) return (
    <>
      <h2>Unable to load users. Try again later.</h2>
      <h3>Status: {error.status}</h3>
    </>
  )

  const renderedUsers = users.map(user => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ))

  return (
    <ul>{renderedUsers}</ul>
  )
}