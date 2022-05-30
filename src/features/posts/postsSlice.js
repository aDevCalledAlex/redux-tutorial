import { 
  createSlice, 
  createAsyncThunk, 
  createSelector,
  createEntityAdapter
} from '@reduxjs/toolkit';

import { client } from '../../api/client'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})
  
const postsSlice = createSlice({
  name: 'posts',
  initialState : postsAdapter.getInitialState({
    status: 'idle',
    error: null
  }),
  reducers: {
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
      
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { id, reaction } = action.payload
      const existingPost = state.entities[id]

      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        // Use the `upsertMany` reducer as a mutating update utility
        const fetchedPosts = action.payload
        postsAdapter.upsertMany(state, fetchedPosts)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // Use the `addOne` reducer for the fulfilled case
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  }
})

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts', 
  async () => {  
    const response = await client.get('/fakeApi/posts')
    return response.data
  }
)

export const addNewPost = createAsyncThunk(
  'posts/addNewPost', 
  async initialPost => {
    // The payload creator receives the partial `{title, content, user}` object
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  }
)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
)