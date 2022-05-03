import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";

const initialState = [
    { 
        id: '1',
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        title: 'First Post!', 
        content: 'Hello!', 
        userId: '1',
        reactions: {
            thumbsUp: 0, 
            hooray: 0, 
            heart: 0, 
            rocket: 0, 
            eyes: 0
        }
    },
    { 
        id: '2', 
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        title: 'Second Post', 
        content: 'More text', 
        userId: '2',
        reactions: {
            thumbsUp: 0, 
            hooray: 0, 
            heart: 0, 
            rocket: 0, 
            eyes: 0
        }
    }
  ]
  
  const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.push(action.payload)
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
            const updatedPost = state.find(post => post.id === id)
            
            if (updatedPost) {
                updatedPost.title = title
                updatedPost.content = content
            }
        },
        reactionAdded(state, action) {
            const { id, reaction } = action.payload
            const reactedPost = state.find(post => post.id === id)

            if (reactedPost) {
                reactedPost.reactions[reaction]++
            }
        }
    }
  })

  export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
  
  export default postsSlice.reducer