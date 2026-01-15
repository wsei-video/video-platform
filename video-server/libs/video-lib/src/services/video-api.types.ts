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

/** User account details */
export interface Account {
  /**
   * Account creation date
   * @format date-time
   */
  createdAt: string;
  /** Unique account email address */
  email: string;
  /** Unique account identifier */
  id: string;
  /** Account display name */
  name: string;
}

/** Account create request schema */
export interface AccountCreate {
  /** Unique account email address */
  email: string;
  /** Account display name */
  name: string;
  /** Account password */
  password: string;
}

/** Paged account list */
export interface Accounts {
  items: Account[];
  /** Whether the next page is available */
  next: boolean;
  /** The total number of available resources */
  total: number;
}

/** Adaptive stream with video and audio combined */
export interface AdaptiveStream {
  /** Adaptive stream format */
  format: string;
  /** Adaptive stream manifest download URL */
  url: string;
}

/** Audio stream */
export interface AudioStream {
  /** Audio stream channel count */
  channels: number;
  /** Audio stream codec */
  codec: MediaCodec;
  /** Audio stream format */
  format: string;
  /** Unique id of the audio stream */
  id: string;
  /** Audio stream size in bytes */
  size: number;
  /** Audio stream manifest download URL */
  url: string;
}

/** Audio stream create request schema */
export interface AudioStreamCreate {
  /** Audio stream channel count */
  channels: number;
  /** Audio stream codec identification in RFC 6381 format */
  codecId: string;
  /** Audio stream codec name */
  codecName: string;
  /** Audio stream size in bytes */
  size: number;
  /** Audio stream name */
  stream: string;
}

/** Currently signed in account session */
export interface Auth {
  /** Access token for API endpoints */
  accessToken: string;
  /** Current authenticated account */
  account: Account;
  /** Current authenticated user session */
  session: AuthSession;
}

/** Account authentication session details */
export interface AuthSession {
  /** Name of the browser used for sign in */
  browser: string | null;
  /**
   * Session creation date
   * @format date-time
   */
  createdAt: string;
  /** Name and/or version of the device of system used for sign in */
  device: string | null;
  /** Unique session identifier */
  id: string;
  /**
   * Last time that the session was used to access the API endpoints
   * @format date-time
   */
  lastAccessAt: string;
}

export interface AuthSessionControllerDeleteV1Params {
  sessionId: number;
}

export interface AuthSessionControllerFindV1Params {
  sessionId: number;
}

export interface AuthSessionControllerListV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
}

/** Sign in schema */
export interface AuthSessionCreate {
  /** Account email address */
  email: string;
  /** Account password */
  password: string;
}

/** Paged account authentication session list */
export interface AuthSessions {
  /** Account authentication session list */
  items: AuthSession[];
  /** Whether the next page is available */
  next: boolean;
  /** The total number of available resources */
  total: number;
}

/** Channel details */
export interface Channel {
  /**
   * Account creation date
   * @format date-time
   */
  createdAt: string;
  /** Unique channel identifier */
  id: string;
  /** Channel display name */
  name: string;
  /** Unique channel URL slug */
  slug: string;
}

/** Link the account with the channel */
export interface ChannelAccountCreate {
  /** Unique channel identifier */
  accountId: string;
}

export interface ChannelControllerAccountsV1Params {
  channelId: number;
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
}

export interface ChannelControllerDeleteV1Params {
  channelId: number;
}

export interface ChannelControllerFindBySlugV1Params {
  channelSlug: string;
}

export interface ChannelControllerFindV1Params {
  channelId: number;
}

export interface ChannelControllerLinkChannelAccountV1Params {
  channelId: number;
}

export interface ChannelControllerListV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
}

export interface ChannelControllerRevokeAccountAccessV1Params {
  accountId: number;
  channelId: number;
}

export interface ChannelControllerUpdateV1Params {
  channelId: number;
}

export interface ChannelControllerVideosV1Params {
  channelId: number;
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
}

/** Channel create request schema */
export interface ChannelCreate {
  /** Channel display name */
  name: string;
  /** Unique channel URL slug */
  slug: string;
}

/** Channel update request schema */
export interface ChannelUpdate {
  /** Channel display name */
  name?: string;
  /** Unique channel URL slug */
  slug?: string;
}

/** Paged channel list */
export interface Channels {
  items: Channel[];
  /** Whether the next page is available */
  next: boolean;
  /** The total number of available resources */
  total: number;
}

export interface Image {
  /** Unique image identifier */
  id: string;
  /** List of available image variants */
  variants: ImageVariant[];
}

export interface ImageVariant {
  /** Height in pixels */
  height: number;
  /** Download URL */
  url: string;
  /** Width in pixels */
  width: number;
}

export interface Images {
  items: Image[];
  /** Whether the next page is available */
  next: boolean;
  /** The total number of available resources */
  total: number;
}

/** Media codec information */
export interface MediaCodec {
  /** Codec identification in RFC 6381 format */
  id: string;
  /** Codec name */
  name: string;
}

/** Available media streams */
export interface MediaStreams {
  /** List of adaptive streams */
  adaptive: AdaptiveStream[];
  /** List of audio streams */
  audio: AudioStream[];
  /** Video scrubber image */
  scrubber: VideoScrubberImage | null;
  /** List of video streams */
  video: VideoStream[];
}

/** Aggregated reaction details  */
export interface ReactionAggregate {
  /** Reaction content (e.g., like, dislike) */
  content: string;
  /** Number of reactions of this type on the resource */
  count: number;
}

export interface SearchControllerSearchV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /** Content search phrase */
  phrase: string;
}

export interface Video {
  /** Channel that owns this video */
  channel: Channel;
  /** Comment count */
  commentCount: number;
  /**
   * Video upload date
   * @format date-time
   */
  createdAt: string;
  /** Video description */
  description: string;
  /** Video duration in seconds */
  duration: number;
  /** Unique video identifier */
  id: string;
  /** Aggregated video reactions */
  reactions: ReactionAggregate[];
  /** Processing status */
  status: VideoStatus;
  /** Video thumbnail */
  thumbnail: Image | null;
  /** Video title */
  title: string;
  /** Video reaction of the current user */
  userReaction: VideoReaction | null;
  /** View count */
  views: number;
  /** Video visibility */
  visibility: VideoVisibility;
}

/** Video comment details */
export interface VideoComment {
  /** Comment content */
  content: string;
  /**
   * Comment creation date
   * @format date-time
   */
  createdAt: string;
  /** Unique comment identifier */
  id: string;
  /** Aggregated comment reactions */
  reactions: ReactionAggregate[];
  /** Number of replies to the comment */
  replyCount: number;
  /**
   * Comment updated date
   * @format date-time
   */
  updatedAt: string | null;
  /** Comment author */
  user: Account;
  /** Video comment reaction of the current user */
  userReaction: VideoCommentReaction | null;
  /** Comment video id */
  videoId: string | null;
}

export interface VideoCommentControllerCreateV1Params {
  videoId: number;
}

export interface VideoCommentControllerDeleteV1Params {
  commentId: number;
  videoId: number;
}

export interface VideoCommentControllerFindV1Params {
  commentId: number;
  videoId: number;
}

export interface VideoCommentControllerListV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
  videoId: number;
}

export interface VideoCommentControllerUpdateV1Params {
  commentId: number;
  videoId: number;
}

/** VideoComment create schema */
export interface VideoCommentCreate {
  /** Comment content */
  content: string;
}

/** Video comment reaction details */
export interface VideoCommentReaction {
  /** Comment the reaction belongs to */
  commentId: string;
  /** Reaction content (e.g., like, dislike) */
  content: string;
  /**
   * Reaction creation date
   * @format date-time
   */
  createdAt: string;
  /** Unique comment reaction identifier */
  id: string;
  /** User who created the reaction */
  userId: string;
}

export interface VideoCommentReactionControllerDeleteV1Params {
  commentId: number;
  reactionId: number;
  videoId: string;
}

export interface VideoCommentReactionControllerFindV1Params {
  commentId: number;
  reactionId: number;
  videoId: string;
}

export interface VideoCommentReactionControllerListV1Params {
  commentId: number;
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
  videoId: string;
}

export interface VideoCommentReactionControllerMeV1Params {
  commentId: number;
  videoId: string;
}

export interface VideoCommentReactionControllerReactV1Params {
  commentId: number;
  videoId: string;
}

export interface VideoCommentReactionControllerRemoveReactionV1Params {
  commentId: number;
  videoId: string;
}

/** Video comment reaction create schema */
export interface VideoCommentReactionCreate {
  /** Reaction content (e.g., like, dislike) */
  content: string;
}

/** Paged comment reaction list */
export interface VideoCommentReactions {
  /** Comment reactions */
  items: VideoCommentReaction[];
  /** Whether the next page is available */
  next: boolean;
  /** The total number of available resources */
  total: number;
}

/** Paged video comment reply list */
export interface VideoCommentReplies {
  /** Video comment replies */
  items: VideoCommentReply[];
  /** Whether the next page is available */
  next: boolean;
  /** The total number of available resources */
  total: number;
}

/** Video comment reply details */
export interface VideoCommentReply {
  /** Video comment parent id */
  commentId: string | null;
  /** Comment content */
  content: string;
  /**
   * Comment creation date
   * @format date-time
   */
  createdAt: string;
  /** Unique comment identifier */
  id: string;
  /** Aggregated comment reactions */
  reactions: ReactionAggregate[];
  /**
   * Comment updated date
   * @format date-time
   */
  updatedAt: string | null;
  /** Comment author */
  user: Account;
  /** Video comment reaction of the current user */
  userReaction: VideoCommentReaction | null;
  /** Comment video id */
  videoId: string | null;
}

export interface VideoCommentReplyControllerCommentV1Params {
  commentId: number;
  videoId: number;
}

export interface VideoCommentReplyControllerDeleteV1Params {
  commentId: number;
  replyId: number;
  videoId: number;
}

export interface VideoCommentReplyControllerFindV1Params {
  commentId: number;
  replyId: number;
  videoId: number;
}

export interface VideoCommentReplyControllerListV1Params {
  commentId: number;
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
  videoId: number;
}

export interface VideoCommentReplyControllerUpdateV1Params {
  commentId: number;
  replyId: number;
  videoId: number;
}

/** Video comment reply create schema */
export interface VideoCommentReplyCreate {
  /** Comment content */
  content: string;
}

/** Video comment reply update schema */
export interface VideoCommentReplyUpdate {
  /** Comment content */
  content?: string;
}

/** VideoComment update schema */
export interface VideoCommentUpdate {
  /** Comment content */
  content?: string;
}

/** Paged video comment list */
export interface VideoComments {
  /** Video comments */
  items: VideoComment[];
  /** Whether the next page is available */
  next: boolean;
  /** The total number of available resources */
  total: number;
}

export interface VideoControllerCreateSourceV1Params {
  videoId: number;
}

export interface VideoControllerDeleteThumbnailV1Params {
  thumbnailId: number;
  videoId: number;
}

export interface VideoControllerDeleteV1Params {
  videoId: number;
}

export interface VideoControllerFindSourceV1Params {
  videoId: number;
}

export interface VideoControllerFindThumbnailV1Params {
  thumbnailId: number;
  videoId: number;
}

export interface VideoControllerFindV1Params {
  videoId: number;
}

export interface VideoControllerListThumbnailsV1Params {
  videoId: number;
}

export interface VideoControllerRecommendedV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
  videoId: number;
}

export interface VideoControllerUpdateSourceV1Params {
  videoId: number;
}

export interface VideoControllerUpdateV1Params {
  videoId: number;
}

/** Video create request schema */
export interface VideoCreate {
  /** Channel that video is on */
  channelId: string;
  /**
   * Video description
   * @default ""
   */
  description: string;
  /** [Internal] Video duration in seconds */
  duration?: number;
  /** [Internal] Processing status */
  status?: VideoStatus;
  /** Unique thumbnail identifier */
  thumbnailId?: string | null;
  /** Video title */
  title: string;
  /** [Internal] View count */
  views?: number;
  /**
   * Video visibility
   * @default "public"
   */
  visibility: VideoVisibility;
}

export interface VideoFeedControllerForYouV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
}

export interface VideoFeedControllerMostPopularV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
}

export interface VideoFeedControllerRecentlyUploadedV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
}

export interface VideoFeedControllerTrendingV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
}

/** Video reaction details */
export interface VideoReaction {
  /** Reaction content (e.g., like, dislike) */
  content: string;
  /**
   * Reaction creation date
   * @format date-time
   */
  createdAt: string;
  /** Unique video reaction identifier */
  id: string;
  /** User who created the reaction */
  userId: string;
  /** Video the reaction belongs to */
  videoId: string;
}

export interface VideoReactionControllerDeleteV1Params {
  reactionId: number;
  videoId: number;
}

export interface VideoReactionControllerFindV1Params {
  reactionId: number;
  videoId: number;
}

export interface VideoReactionControllerListV1Params {
  /**
   * Maximum number of resources per page
   * @default 20
   */
  count?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
  videoId: number;
}

export interface VideoReactionControllerReactV1Params {
  videoId: number;
}

export interface VideoReactionControllerReactionV1Params {
  videoId: number;
}

export interface VideoReactionControllerRemoveReactionV1Params {
  videoId: number;
}

/** Video reaction create schema */
export interface VideoReactionCreate {
  /** Reaction content (e.g., like, dislike) */
  content: string;
}

/** Paged video reaction list */
export interface VideoReactions {
  /** Video reactions */
  items: VideoReaction[];
  /** Whether the next page is available */
  next: boolean;
  /** The total number of available resources */
  total: number;
}

export interface VideoScrubberImage {
  /** Number of frames in a row */
  columns: number;
  /** Number of image files */
  count: number;
  /** Duration in seconds for one frame to be displayed */
  frameDuration: number;
  /** Frame height in pixels */
  height: number;
  /** Number of frames in a column */
  rows: number;
  /** List of URLs for each image file */
  urls: string[];
  /** Frame width in pixels */
  width: number;
}

export interface VideoScrubberImageCreate {
  /** Number of frames in a row */
  columns: number;
  /** Number of image files */
  count: number;
  /** Duration in seconds for one frame to be displayed */
  frameDuration: number;
  /** Frame height in pixels */
  height: number;
  /** Number of frames in a column */
  rows: number;
  /** Frame width in pixels */
  width: number;
}

/** Information about video source file */
export interface VideoSource {
  /** Name of the uploaded file */
  name: string;
  /** Size of the uploaded file in bytes */
  size: number;
  /** Uploaded file download URL */
  url: string;
  /** User that uploaded the file */
  user: Account | null;
}

/** Update information about video source file */
export interface VideoSourceUpdate {
  /** Uploaded file key */
  key: string;
  /** Name of the uploaded file */
  name: string;
  /** Size of the uploaded file in bytes */
  size: number;
  /** Id of user that uploaded the file */
  userId: string;
}

/** Processing status */
export type VideoStatus = "none" | "processing" | "successful" | "failed";

/** Video stream */
export interface VideoStream {
  /** Average video stream bits per second */
  averageBitrate: number;
  /** Video stream codec */
  codec: MediaCodec;
  /** Video stream format */
  format: string;
  /** Video stream frames per second */
  framerate: number;
  /** Video stream height in pixels */
  height: number;
  /** Unique id of the video stream */
  id: string;
  /** Maximum instantaneous video stream bits per second */
  peakBitrate: number;
  /** Video stream size in bytes */
  size: number;
  /** Video stream manifest download URL */
  url: string;
  /** Video stream width in pixels */
  width: number;
}

export interface VideoStreamControllerCreateAudioStreamV1Params {
  videoId: number;
}

export interface VideoStreamControllerCreateScrubberImageV1Params {
  videoId: number;
}

export interface VideoStreamControllerCreateThumbnailV1Params {
  videoId: number;
}

export interface VideoStreamControllerCreateVideoStreamV1Params {
  videoId: number;
}

export interface VideoStreamControllerListV1Params {
  videoId: number;
}

/** Video stream create request schema */
export interface VideoStreamCreate {
  /** Average video stream bits per second */
  averageBitrate: number;
  /** Video stream codec identification in RFC 6381 format */
  codecId: string;
  /** Video stream codec name */
  codecName: string;
  /** Video stream frames per second */
  framerate: number;
  /** Video stream height */
  height: number;
  /** Maximum instantaneous video stream bits per second */
  peakBitrate: number;
  /** Video stream size in bytes */
  size: number;
  /** Video stream name */
  stream: string;
  /** Video stream width */
  width: number;
}

export interface VideoThumbnailCreate {
  /** Thumbnail name */
  name: string;
  /** Whether to select this thumbnail for the video */
  select: boolean;
  /** Thumbnail variants */
  variants: string;
}

/** Video update request schema */
export interface VideoUpdate {
  /**
   * Video description
   * @default ""
   */
  description?: string;
  /** [Internal] Video duration in seconds */
  duration?: number;
  /** [Internal] Processing status */
  status?: VideoStatus;
  /** Unique thumbnail identifier */
  thumbnailId?: string | null;
  /** Video title */
  title?: string;
  /** [Internal] View count */
  views?: number;
  /**
   * Video visibility
   * @default "public"
   */
  visibility?: VideoVisibility;
}

/** Object containing video upload URL */
export interface VideoUploadSource {
  /** Resumable video upload URL via TUS */
  resumableUploadUrl: string;
  /** Resumable video upload URL via multipart */
  simpleUploadUrl: string;
}

/** Video visibility */
export type VideoVisibility = "public" | "private" | "unlisted";

export interface Videos {
  items: Video[];
  /** Whether the next page is available */
  next: boolean;
  /** The total number of available resources */
  total: number;
}
