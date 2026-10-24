// exhibitionSchema.js — 适配 Prisma Exhibition 模型（related_artwork 改为 JSON 对象数组）
import { z } from 'zod';
import { markFieldSchema } from "./mark_schema";

// 单个关联作品：标题 + 自定义排序 + 标记
// 对应 Prisma 中的 related_artwork Json?（结构参照 ArtistContact.socialMedia）
export const relatedArtworkSchema = z.object({
  title: z.string().optional(),
  order: z.string().optional(),
  mark: markFieldSchema,
});

// Exhibition schema – 与 Prisma Exhibition 模型完全匹配
export const exhibitionSchema = z.object({
  // 自动生成的 ID（对应 Prisma 中的 _id）
  id: z.string().optional(),

  // 核心字段
  cover_img_url: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  type: z.string().optional(),
  date_start: z.string().optional(),
  date_end: z.string().optional(),
  opening_date: z.string().optional(),
  year: z.string().optional(),
  venue: z.string().optional(),
  location: z.string().optional(),
  curator: z.string().optional(),
  organiser: z.string().optional(),
  participating_artists: z.string().optional(),

  // 文本内容（数组字段）
  caption: z.string().optional(),
  description: z.string().optional(),
  introduction: z.array(z.string()).optional(),
  press_release: z.array(z.string()).optional(),

  // 关联作品：字符串数组（作品标题）——与 related_exhibition 同一套逻辑。
  // 排序不在这里保存：作品在展览页的顺序由作品自身的
  // `order.exhibition_page_order` 决定（在作品排序页设置）。
  // 旧的 `[{ title, order, mark }]` 数据仍可通过校验（读取时由表单折叠为标题）。
  related_artwork: z.array(z.union([z.string(), relatedArtworkSchema])).optional(),

  related_artist: z.array(z.string()).optional(),

  // 媒体链接
  video_url: z.string().optional(),
  web_url: z.string().optional(),

  // 系统/管理字段
  order: z.string().optional(),
  mark: z.string().optional(),
  language: z.string().optional(),
  status: z.string().optional(),

  // 更新时间（由 Prisma 自动维护）
  updatedAt: z.string().optional(), // API 返回 ISO 字符串
});

export type RelatedArtwork = z.infer<typeof relatedArtworkSchema>;
export type Exhibition = z.infer<typeof exhibitionSchema>;

// 创建展览时，省略自动生成的 id 和 updatedAt
export const createExhibitionSchema = exhibitionSchema.omit({ id: true, updatedAt: true });
export type CreateExhibitionInput = z.infer<typeof createExhibitionSchema>;

// 更新展览时，id 必须提供，其他字段均为可选
export const updateExhibitionSchema = exhibitionSchema.partial().required({ id: true });
export type UpdateExhibitionInput = z.infer<typeof updateExhibitionSchema>;