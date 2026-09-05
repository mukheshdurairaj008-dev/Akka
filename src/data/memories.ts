import { MEMORY_PHOTOS } from "./photos"

export interface Memory {
  id: number
  imagePath: string
  side: "left" | "right"
}

export const memories: Memory[] = MEMORY_PHOTOS.map((imagePath, index) => ({
  id: index + 1,
  imagePath: imagePath || `/photos/memory-${String(index + 1).padStart(2, "0")}.jpg`,
  side: index % 2 === 0 ? "left" : "right",
}))
