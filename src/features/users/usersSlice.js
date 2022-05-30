import { 
  createSlice, 
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'

import { client } from '../../api/client'

const usersAdapter = createEntityAdapter()

const usersSlice = createSlice({
  name: 'users',
  initialState : usersAdapter.getInitialState({
    status: 'idle',
    error: null
  }),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Set any fetched users to the array
        const fetchedUsers = action.payload
        usersAdapter.setAll(state, fetchedUsers)
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { 
  selectAll: selectAllUsers, 
  selectById: selectUserById
} = usersAdapter.getSelectors(state => state.users)

export default usersSlice.reducer

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers', 
  async () => {
    const response = await client.get('/fakeApi/users') 
    return response.data
})