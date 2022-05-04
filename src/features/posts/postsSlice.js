import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";

const initialState = {
    posts: [],
    status: 'idle',
    error: null
}
  
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        userId,
                        reactions: {
                            thumbsUp: 0, 
                            hooray: 0, 
                            heart: 0, 
                            rocket: 0, 
                            eyes: 0
                        }
                    }
                }
            }
        },
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
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {  
	const response = await client.get('/fakeApi/posts')  
	return response.data
})