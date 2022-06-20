import React from 'react'

import { useAddReactionMutation } from '../api/apiSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

export const ReactionButtons = ({ postId, postReactions }) => {
  const [addReaction] = useAddReactionMutation()

  const reactionButtons = Object.entries(reactionEmoji).map(
    ([reactionName, emoji]) => {
      return (
        <button 
          key={reactionName} 
          type="button" 
          className="muted-button reaction-button"
          onClick={() =>
            addReaction({ postId, reaction: reactionName })
          }>
          {emoji} {postReactions[reactionName]}
        </button>
      )
    }
  )

  return <div>{reactionButtons}</div>
}