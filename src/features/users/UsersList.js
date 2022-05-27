import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectAllUsers, selectUserIds } from './usersSlice'

export const UsersList = () => {
  const userIds = useSelector(selectUserIds)
  const users = useSelector(selectAllUsers)

  const renderedUsers = userIds.map(userId => {
    const user = users[userId]

    return (
      <li key={user.id}>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </li>
     )
  })

  return (
    <section>
      <h2>Users</h2>

      <ul>{renderedUsers}</ul>
    </section>
  )
}