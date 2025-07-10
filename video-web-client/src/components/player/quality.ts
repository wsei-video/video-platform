import { computed } from 'vue'
import type { Level } from 'hls.js'

import { useVideoPlayerStore } from '@/store'

export class QualityLevel {
  public constructor(
    public readonly name: string,
    public readonly height: number,
    public readonly hlsIndex: number,
    public readonly hlsLevel: Level,
  ) {}

  public static fromHlsLevel(hlsLevel: Level, hlsIndex: number): QualityLevel {
    const namePrefix = hlsLevel.name || hlsLevel.height
    const name = namePrefix ? `${namePrefix}p` : ''
    return new QualityLevel(name, hlsLevel.height, hlsIndex, hlsLevel)
  }

  public static fromHlsLevels(hlsLevels: Level[]): QualityLevel[] {
    return hlsLevels.map(QualityLevel.fromHlsLevel)
  }
}

export type QualityOption = { name: string; level: QualityLevel | null }

export const useQualityOptions = () => {
  const videoPlayerStore = useVideoPlayerStore()
  const autoQualityOption: QualityOption = { name: 'Auto', level: null }

  const qualityOptions = computed<QualityOption[]>(() => {
    const definedQualityOptions = videoPlayerStore.qualityLevels.map((level) => ({
      name: level.name,
      level,
    }))
    return [...definedQualityOptions, autoQualityOption]
  })

  return qualityOptions
}
