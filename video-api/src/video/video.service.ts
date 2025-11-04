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

  public getMostPopularVideos(): Video[] {
    return MOCK_VIDEOS;
  }

  public getRecentlyUploadedVideos(): Video[] {
    return MOCK_VIDEOS;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getForYouVideos(userId: string): Video[] {
    return MOCK_VIDEOS;
  }

  public getSearchedVideos(searchPhrase: string): Video[] {
    return MOCK_VIDEOS.filter(v => v.title.includes(searchPhrase)) || [];
  }
}
