import { 
  createSlice, 
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'

import { client } from '../../api/client'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState({
  status: 'idle',
  error: null
})

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
        const fetchedUsers = action.payload
        usersAdapter.setAll(fetchedUsers)
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default usersSlice.reducer

export const { 
  selectAll: selectAllUsers, 
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors(state => state.users)

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers', 
  async () => {
    const response = await client.get('/fakeApi/users') 
    return response.data
})