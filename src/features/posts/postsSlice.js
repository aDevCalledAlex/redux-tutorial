import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";

import { client } from '../../api/client'

const initialState = {
    posts: [],
    status: 'idle',
    error: null
}
  
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const updatedPost = state.posts.find(post => post.id === id)
            
            if (updatedPost) {
                updatedPost.title = title
                updatedPost.content = content
            }
        },
        reactionAdded(state, action) {
            const { id, reaction } = action.payload
            const reactedPost = state.posts.find(post => post.id === id)

            if (reactedPost) {
                reactedPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) {
        builder
          .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // Add any fetched posts to the array
            state.posts = state.posts.concat(action.payload)
          })
          .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
          .addCase(addNewPost.fulfilled, (state, action) => {
            // We can directly add the new post object to our posts array
            state.posts.push(action.payload)
          })
      }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)

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