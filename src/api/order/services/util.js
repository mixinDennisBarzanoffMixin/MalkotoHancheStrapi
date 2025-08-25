
export const getThumbnailImageSafe = (image) => {
    if (!image) {
        return null;
    }
  if (image.formats?.thumbnail) {
    return image.formats.thumbnail.url;
  }
  if (image.formats?.small) {
    return image.formats.small.url;
  }
  if (image.formats?.medium) {
    return image.formats.medium.url;
  }
  if (image.formats?.large) {
    return image.formats.large.url;
  }
  return image.url;
};


export const attachBaseUrlIfOnlyPath = (image) => {
    if (image && image.startsWith("/")) {
        return `${process.env.BACKEND_URL}${image}`;
    }
    return image;
}