/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Account create request schema */
export interface AccountCreateDto {
  /** Unique account email address */
  email: string
  /** Account display name */
  name: string
  /** Account password */
  password: string
}

/** User account details */
export interface AccountDto {
  /**
   * Account creation date
   * @format date-time
   */
  createdAt: string
  /** Unique account email address */
  email: string
  /** Unique account identifier */
  id: string
  /** Account display name */
  name: string
}

/** Paged account list */
export interface AccountsDto {
  items: AccountDto[]
  /** Whether the next page is available */
  next: boolean
  /** The total number of available resources */
  total: number
}

/** Adaptive stream with video and audio combined */
export interface AdaptiveStreamDto {
  /** Adaptive stream format */
  format: string
  /** Adaptive stream manifest download URL */
  url: string
}

/** Audio stream create request schema */
export interface AudioStreamCreateDto {
  /** Audio stream channel count */
  channels: number
  /** Audio stream codec identification in RFC 6381 format */
  codecId: string
  /** Audio stream codec name */
  codecName: string
  /** Audio stream size in bytes */
  size: number
  /** Audio stream name */
  stream: string
}

/** Audio stream */
export interface AudioStreamDto {
  /** Audio stream channel count */
  channels: number
  /** Audio stream codec */
  codec: MediaCodecDto
  /** Audio stream format */
  format: string
  /** Unique id of the audio stream */
  id: string
  /** Audio stream size in bytes */
  size: number
  /** Audio stream manifest download URL */
  url: string
}

/** Currently signed in account session */
export interface AuthDto {
  /** Access token for API endpoints */
  accessToken: string
  /** Current authenticated account */
  account: AccountDto
  /** Current authenticated user session */
  session: AuthSessionDto
}

export interface AuthSessionControllerListV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
}

/** Sign in schema */
export interface AuthSessionCreateDto {
  /** Account email address */
  email: string
  /** Account password */
  password: string
}

/** Account authentication session details */
export interface AuthSessionDto {
  /** Name of the browser used for sign in */
  browser: string | null
  /**
   * Session creation date
   * @format date-time
   */
  createdAt: string
  /** Name and/or version of the device of system used for sign in */
  device: string | null
  /** Unique session identifier */
  id: string
  /**
   * Last time that the session was used to access the API endpoints
   * @format date-time
   */
  lastAccessAt: string
}

/** Paged account authentication session list */
export interface AuthSessionsDto {
  /** Account authentication session list */
  items: AuthSessionDto[]
  /** Whether the next page is available */
  next: boolean
  /** The total number of available resources */
  total: number
}

/** Link the account with the channel */
export interface ChannelAccountCreateDto {
  /** Unique channel identifier */
  accountId: string
}

export interface ChannelControllerAccountsV1ParamsDto {
  channelId: number
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
}

export interface ChannelControllerListV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
}

export interface ChannelControllerVideosV1ParamsDto {
  channelId: number
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
}

/** Channel create request schema */
export interface ChannelCreateDto {
  /** Channel display name */
  name: string
  /** Unique channel URL slug */
  slug: string
}

/** Channel details */
export interface ChannelDto {
  /**
   * Account creation date
   * @format date-time
   */
  createdAt: string
  /** Unique channel identifier */
  id: string
  /** Channel display name */
  name: string
  /** Unique channel URL slug */
  slug: string
}

/** Channel update request schema */
export interface ChannelUpdateDto {
  /** Channel display name */
  name?: string
  /** Unique channel URL slug */
  slug?: string
}

/** Paged channel list */
export interface ChannelsDto {
  items: ChannelDto[]
  /** Whether the next page is available */
  next: boolean
  /** The total number of available resources */
  total: number
}

/** Media codec information */
export interface MediaCodecDto {
  /** Codec identification in RFC 6381 format */
  id: string
  /** Codec name */
  name: string
}

/** Available media streams */
export interface MediaStreamsDto {
  /** List of adaptive streams */
  adaptive: AdaptiveStreamDto[]
  /** List of audio streams */
  audio: AudioStreamDto[]
  /** Video scrubber image */
  scrubber: VideoScrubberImageDto | null
  /** List of video streams */
  video: VideoStreamDto[]
}

/** Aggregated reaction details  */
export interface ReactionAggregateDto {
  /** Reaction content (e.g., like, dislike) */
  content: string
  /** Number of reactions of this type on the resource */
  count: number
}

export interface SearchControllerSearchV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
  /** Content search phrase */
  phrase: string
}

export interface VideoCommentControllerListV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
  videoId: number
}

/** VideoComment create schema */
export interface VideoCommentCreateDto {
  /** Comment content */
  content: string
}

/** Video comment details */
export interface VideoCommentDto {
  /** Comment content */
  content: string
  /**
   * Comment creation date
   * @format date-time
   */
  createdAt: string
  /** Unique comment identifier */
  id: string
  /** Aggregated comment reactions */
  reactions: ReactionAggregateDto[]
  /** Number of replies to the comment */
  replyCount: number
  /**
   * Comment updated date
   * @format date-time
   */
  updatedAt: string | null
  /** Comment author */
  user: AccountDto
  /** Video comment reaction of the current user */
  userReaction: VideoCommentReactionDto | null
  /** Comment video id */
  videoId: string | null
}

export interface VideoCommentReactionControllerListV1ParamsDto {
  commentId: number
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
  videoId: string
}

/** Video comment reaction create schema */
export interface VideoCommentReactionCreateDto {
  /** Reaction content (e.g., like, dislike) */
  content: string
}

/** Video comment reaction details */
export interface VideoCommentReactionDto {
  /** Comment the reaction belongs to */
  commentId: string
  /** Reaction content (e.g., like, dislike) */
  content: string
  /**
   * Reaction creation date
   * @format date-time
   */
  createdAt: string
  /** Unique comment reaction identifier */
  id: string
  /** User who created the reaction */
  userId: string
}

/** Paged comment reaction list */
export interface VideoCommentReactionsDto {
  /** Comment reactions */
  items: VideoCommentReactionDto[]
  /** Whether the next page is available */
  next: boolean
  /** The total number of available resources */
  total: number
}

/** Paged video comment reply list */
export interface VideoCommentRepliesDto {
  /** Video comment replies */
  items: VideoCommentReplyDto[]
  /** Whether the next page is available */
  next: boolean
  /** The total number of available resources */
  total: number
}

export interface VideoCommentReplyControllerListV1ParamsDto {
  commentId: number
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
  videoId: number
}

/** Video comment reply create schema */
export interface VideoCommentReplyCreateDto {
  /** Comment content */
  content: string
}

/** Video comment reply details */
export interface VideoCommentReplyDto {
  /** Video comment parent id */
  commentId: string | null
  /** Comment content */
  content: string
  /**
   * Comment creation date
   * @format date-time
   */
  createdAt: string
  /** Unique comment identifier */
  id: string
  /** Aggregated comment reactions */
  reactions: ReactionAggregateDto[]
  /**
   * Comment updated date
   * @format date-time
   */
  updatedAt: string | null
  /** Comment author */
  user: AccountDto
  /** Video comment reaction of the current user */
  userReaction: VideoCommentReactionDto | null
  /** Comment video id */
  videoId: string | null
}

/** Video comment reply update schema */
export interface VideoCommentReplyUpdateDto {
  /** Comment content */
  content?: string
}

/** VideoComment update schema */
export interface VideoCommentUpdateDto {
  /** Comment content */
  content?: string
}

/** Paged video comment list */
export interface VideoCommentsDto {
  /** Video comments */
  items: VideoCommentDto[]
  /** Whether the next page is available */
  next: boolean
  /** The total number of available resources */
  total: number
}

export interface VideoControllerRecommendedV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
  videoId: number
}

/** Video create request schema */
export interface VideoCreateDto {
  /** Channel that video is on */
  channelId: string
  /**
   * Video description
   * @default ""
   */
  description: string
  /** [Internal] Video duration in seconds */
  duration?: number
  /** [Internal] Processing status */
  status?: VideoStatusDto
  /** Video title */
  title: string
  /** [Internal] View count */
  views?: number
  /**
   * Video visibility
   * @default "public"
   */
  visibility: VideoVisibilityDto
}

export interface VideoDto {
  /** Channel that owns this video */
  channel: ChannelDto
  /** Comment count */
  commentCount: number
  /**
   * Video upload date
   * @format date-time
   */
  createdAt: string
  /** Video description */
  description: string
  /** Video duration in seconds */
  duration: number
  /** Unique video identifier */
  id: string
  /** Aggregated video reactions */
  reactions: ReactionAggregateDto[]
  /** Processing status */
  status: VideoStatusDto
  /** Thumbnail URL */
  thumbnail: string
  /** Video title */
  title: string
  /** Video reaction of the current user */
  userReaction: VideoReactionDto | null
  /** View count */
  views: number
  /** Video visibility */
  visibility: VideoVisibilityDto
}

export interface VideoFeedControllerForYouV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
}

export interface VideoFeedControllerMostPopularV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
}

export interface VideoFeedControllerRecentlyUploadedV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
}

export interface VideoFeedControllerTrendingV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
}

export interface VideoReactionControllerListV1ParamsDto {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number
  /**
   * Page number
   * @default 1
   */
  page?: number
  videoId: number
}

/** Video reaction create schema */
export interface VideoReactionCreateDto {
  /** Reaction content (e.g., like, dislike) */
  content: string
}

/** Video reaction details */
export interface VideoReactionDto {
  /** Reaction content (e.g., like, dislike) */
  content: string
  /**
   * Reaction creation date
   * @format date-time
   */
  createdAt: string
  /** Unique video reaction identifier */
  id: string
  /** User who created the reaction */
  userId: string
  /** Video the reaction belongs to */
  videoId: string
}

/** Paged video reaction list */
export interface VideoReactionsDto {
  /** Video reactions */
  items: VideoReactionDto[]
  /** Whether the next page is available */
  next: boolean
  /** The total number of available resources */
  total: number
}

export interface VideoScrubberImageCreateDto {
  /** Number of frames in a row */
  columns: number
  /** Number of image files */
  count: number
  /** Duration in seconds for one frame to be displayed */
  frameDuration: number
  /** Frame height in pixels */
  height: number
  /** Number of frames in a column */
  rows: number
  /** Frame width in pixels */
  width: number
}

export interface VideoScrubberImageDto {
  /** Number of frames in a row */
  columns: number
  /** Number of image files */
  count: number
  /** Duration in seconds for one frame to be displayed */
  frameDuration: number
  /** Frame height in pixels */
  height: number
  /** Number of frames in a column */
  rows: number
  /** List of URLs for each image file */
  urls: string[]
  /** Frame width in pixels */
  width: number
}

/** Information about video source file */
export interface VideoSourceDto {
  /** Name of the uploaded file */
  name: string
  /** Size of the uploaded file in bytes */
  size: number
  /** Uploaded file download URL */
  url: string
  /** User that uploaded the file */
  user: AccountDto | null
}

/** Update information about video source file */
export interface VideoSourceUpdateDto {
  /** Uploaded file key */
  key: string
  /** Name of the uploaded file */
  name: string
  /** Size of the uploaded file in bytes */
  size: number
  /** Id of user that uploaded the file */
  userId: string
}

/** Processing status */
export type VideoStatusDto = 'none' | 'processing' | 'successful' | 'failed'

/** Video stream create request schema */
export interface VideoStreamCreateDto {
  /** Average video stream bits per second */
  averageBitrate: number
  /** Video stream codec identification in RFC 6381 format */
  codecId: string
  /** Video stream codec name */
  codecName: string
  /** Video stream frames per second */
  framerate: number
  /** Video stream height */
  height: number
  /** Maximum instantaneous video stream bits per second */
  peakBitrate: number
  /** Video stream size in bytes */
  size: number
  /** Video stream name */
  stream: string
  /** Video stream width */
  width: number
}

/** Video stream */
export interface VideoStreamDto {
  /** Average video stream bits per second */
  averageBitrate: number
  /** Video stream codec */
  codec: MediaCodecDto
  /** Video stream format */
  format: string
  /** Video stream frames per second */
  framerate: number
  /** Video stream height in pixels */
  height: number
  /** Unique id of the video stream */
  id: string
  /** Maximum instantaneous video stream bits per second */
  peakBitrate: number
  /** Video stream size in bytes */
  size: number
  /** Video stream manifest download URL */
  url: string
  /** Video stream width in pixels */
  width: number
}

/** Video update request schema */
export interface VideoUpdateDto {
  /**
   * Video description
   * @default ""
   */
  description?: string
  /** [Internal] Video duration in seconds */
  duration?: number
  /** [Internal] Processing status */
  status?: VideoStatusDto
  /** Video title */
  title?: string
  /** [Internal] View count */
  views?: number
  /**
   * Video visibility
   * @default "public"
   */
  visibility?: VideoVisibilityDto
}

/** Object containing video upload URL */
export interface VideoUploadSourceDto {
  /** Resumable video upload URL via TUS */
  resumableUploadUrl: string
  /** Resumable video upload URL via multipart */
  simpleUploadUrl: string
}

/** Video visibility */
export type VideoVisibilityDto = 'public' | 'private' | 'unlisted'

export interface VideosDto {
  items: VideoDto[]
  /** Whether the next page is available */
  next: boolean
  /** The total number of available resources */
  total: number
}
