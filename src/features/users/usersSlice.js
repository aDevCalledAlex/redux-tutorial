import { 
  createEntityAdapter,
  createSelector
} from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice'

const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({    
		getUsers: builder.query({      
			query: () => '/users',
      transformResponse: responseData => usersAdapter.setAll(initialState, responseData)  
		})  
	})
})

export const { getUsers } = extendedApiSlice.endpoints

const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectUsersResult = apiSlice.endpoints.getUsers.select()

const selectUserData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data
)

export const selectUserMetaData = createSelector(
  selectUsersResult,
  usersResult => {
    const {
      isLoading,
      isFetching,
      isSuccess,
      isError,
      error
    } = usersResult
    return {
      isLoading,
      isFetching,
      isSuccess,
      isError,
      error
    }
  }
)

// const emptyUsers = []

// export const selectAllUsers = createSelector(
//   selectUsersResult,
//   usersResult => usersResult?.data ?? emptyUsers
// )

// export const selectUserById = createSelector(
//   [ selectAllUsers, (_, userId) => userId ],
//   (users, userId) => users.find(user => user.id === userId)
// )

export const { 
  selectAll: selectAllUsers, 
  selectById: selectUserById
} = usersAdapter.getSelectors(state => selectUserData(state) ?? initialState)