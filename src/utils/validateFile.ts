export const validateFile = (file: File): string | undefined => {
  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return "Please upload only PNG, JPG, or PDF files.";
  }

  if (file.size > maxSize) {
    return "File size should not exceed 5MB.";
  }

  return undefined;
};
