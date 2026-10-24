import { createImageUploadConfig } from "@/components/forms/images/ImageUploadSection";

export const IMAGE_UPLOAD_CONFIGS = {
  // ---------- 仅保留 Prisma 模型中包含图片字段的配置 ----------
  artwork: createImageUploadConfig({
    fieldName: 'cover_img_url',
    title: 'Artwork Cover Image',
    defaultValue: '',
  }),
  event: createImageUploadConfig({
    fieldName: 'cover_img_url',
    title: 'Event Cover Image',
    defaultValue: '',
  }),
  image: createImageUploadConfig({
    fieldName: 'img_url',
    title: 'Image',
    defaultValue: '',
  }),
  exhibition: createImageUploadConfig({
    fieldName: 'cover_img_url',
    title: 'Exhibition Cover Image',
    defaultValue: '',
  }),
  fair: createImageUploadConfig({
    fieldName: 'cover_img_url',
    title: 'Fair Cover Image',
    defaultValue: '',
  }),
  about: createImageUploadConfig({
    fieldName: 'portrait_image_url',
    title: 'About Portrait Image',
    defaultValue: '',
  }),
  writing: createImageUploadConfig({
    fieldName: 'cover_img_url',
    title: 'Writing Cover Image',
    defaultValue: '',
  }),

  bibliography: createImageUploadConfig({
    fieldName: 'cover_img_url',
    title: 'Bibliography Cover Image',
    defaultValue: '',
  }),

  series: createImageUploadConfig({
    fieldName: 'cover_img_url',
    title: 'Series Cover Image',
    defaultValue: '',
  }),
};