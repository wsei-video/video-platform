export interface CreateVideoReactionCommand {
  videoId: string
  content: string
}

export interface DeleteVideoReactionCommand {
  videoId: string
}

export interface CreateCommentReactionCommand {
  videoId: string
  commentId: string
  content: string
}

export interface DeleteCommentReactionCommand {
  videoId: string
  commentId: string
}