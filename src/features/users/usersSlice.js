import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'

const initialState = {
  users: [],
  state: 'idle',
  error: null
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Set any fetched users to the array
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default usersSlice.reducer

export const selectAllUsers = state => state.users.users

export const selectUserById = (state, userId) => state.users.users.find(user => user.id === userId)

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers', 
  async () => {
    const response = await client.get('/fakeApi/users') 
    return response.data
})