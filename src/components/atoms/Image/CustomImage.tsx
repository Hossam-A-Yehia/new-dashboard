import React from "react";
import { ImageProps } from "@/types/Atoms";

const CustomImage: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  testId,
  fill,
}) => {
  const style: React.CSSProperties = fill ? { objectFit: "cover", width: "100%", height: "100%" } : {};

  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      data-testid={testId}
      loading="lazy"
      style={style}
    />
  );
};

export default CustomImage;
