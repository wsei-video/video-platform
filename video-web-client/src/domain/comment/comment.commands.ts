export interface CommentCreateCommand {
  videoId: string
  content: string
}

export interface CommentUpdateCommand {
  videoId: string
  commentId: string
  content?: string
}

export interface CommentReplyCreateCommand {
  videoId: string
  commentId: string
  content: string
}

export interface CommentReplyUpdateCommand {
  videoId: string
  commentId: string
  replyId: string
  content?: string
}

export interface CommentDeleteCommand {
  videoId: string
  commentId: string
}

export interface CommentReplyDeleteCommand {
  videoId: string
  commentId: string
  replyId: string
}
