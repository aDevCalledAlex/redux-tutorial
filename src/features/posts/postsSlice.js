// import { apiSlice } from '../api/apiSlice'

// const extendedApiSlice = apiSlice.injectEndpoints({
//   // The "endpoints" represent operations and requests for this server
//   endpoints: builder => ({
//     // The `getPosts` endpoint is a "query" operation that returns data
//     getPosts: builder.query({
//       // The URL for the request is '/fakeApi/posts'
//       query: () => '/posts',
//       providesTags: (result = [], error, arg) => [
//         'Post',
//         { type: 'Post', id: 'LIST' },
//         ...result.map(({ id }) => ({ type: 'Post', id }))
//         ]
//     }),
//     getPost: builder.query({
//       query: postId => `posts/${postId}`,
//       providesTags: (result, error, arg) => [{ type: 'Post', id: arg }]
//     }),
//     addNewPost: builder.mutation({
//       query: postInput => ({
//         url: '/posts',
//         method: 'POST',
//         // Include the entire post object as the body of the request
//         body: postInput
//       }),
//       // invalidatesTags: ['Post']
//       invalidatesTags: [{ type: 'Post', id: 'LIST' }]
//     }),
//     editPost: builder.mutation({
//       query: postChanges => ({
//         url: `/posts/${postChanges.id}`,
//         method: 'PATCH',
//         // Include the entire post object as the body of the request
//         body: postChanges 
//       }),
//       invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
//     }),
//     addReaction: builder.mutation({
//       query: ({ postId, reaction }) => ({
//         url: `posts/${postId}/reactions`,
//         method: 'POST',
//         // In a real app, we'd probably need to base this on user ID somehow
//         // so that a user can't do the same reaction more than once
//         body: { reaction }
//       }),
//       async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
//         // `updateQueryData` requires the endpoint name and cache key arguments,
//         // so it knows which piece of cache state to update
//         const patchResult = dispatch(
//           apiSlice.util.updateQueryData('getPosts', undefined, draft => {
//             // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
//             const post = draft.find(post => post.id === postId)
//             if (post) {
//               post.reactions[reaction]++
//             }
//           })
//         )
//         try {
//           await queryFulfilled
//         } catch {
//           patchResult.undo()
//         }
//       }
//     })
//   })
// })

// // Export the auto-generated hook for the `getPosts` query endpoint
// export const { 
//   useGetPostsQuery, 
//   useGetPostQuery,
//   useAddNewPostMutation,
//   useEditPostMutation,
//   useAddReactionMutation
//  } = extendedApiSlice