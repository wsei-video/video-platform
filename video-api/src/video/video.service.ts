import { Injectable } from '@nestjs/common';
import { type Video, MOCK_VIDEOS } from './mock_videos';

@Injectable()
export class VideoService {
  public getVideoById(videoId: string): Video | undefined {
    return MOCK_VIDEOS.find(video => video.id === videoId);
  }

  public getRecomendedVideos(videoId: string): Video[] {
    return MOCK_VIDEOS.filter(video => video.id !== videoId);
  }

  public getTrendingVideos(): Video[] {
    return MOCK_VIDEOS;
  }
}
