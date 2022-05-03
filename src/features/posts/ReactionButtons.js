import React from 'react'
import { useDispatch } from 'react-redux'

import { reactionAdded } from './postsSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

export const ReactionButtons = ({ postId, postReactions }) => {
  const dispatch = useDispatch()

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button 
        key={name} 
        type="button" 
        className="muted-button reaction-button"
        onClick={() =>
          dispatch(reactionAdded({ id: postId, reaction: name }))
        }>
        {emoji} {postReactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}