import { useState } from "react";
import { DropzoneOptions, FileRejection, useDropzone } from "react-dropzone";

interface FilePreview extends Partial<File> {
  preview?: string;
}

enum ErrorCode {
  FILE_TOO_LARGE = "file-too-large",
  FILE_INVALID_TYPE = "file-invalid-type",
  TOO_MANY_FILES = "too-many-files",
  FILE_TOO_SMALL = "file-too-small",
}

const errorMessages = {
  [ErrorCode.FILE_TOO_LARGE]: (file: File, maxSize?: number) =>
    `The file ${file.name} is larger than ${maxSize ?? "unknown"} MB.`,
  [ErrorCode.FILE_INVALID_TYPE]: (file: File) =>
    `The file type of ${file.name} is not supported.`,
  [ErrorCode.TOO_MANY_FILES]: (maxFiles?: number) =>
    `You can upload a maximum of ${maxFiles ?? "unknown"} files.`,
  [ErrorCode.FILE_TOO_SMALL]: (file: File, minSize?: number) =>
    `The file ${file.name} is smaller than ${minSize ?? "unknown"} MB.`,
};

type Args = DropzoneOptions & {
  onChange?: (items: File[]) => void;
  onError?: (error: any) => void; 
  defaultValue?: File | File[] | null;
};

function transformDefaultValue(
  defaultValue?: File | File[] | null
): FilePreview[] {
  if (!defaultValue) return [];
  const files = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  return files.map((file) => ({
    type: file.type,
    name: file.name,
    preview: file.type.includes("image/")
      ? URL.createObjectURL(file)
      : undefined,
  }));
}

export function useFileUploader({ onChange, defaultValue, ...rest }: Args) {
  const [fileList, setFileList] = useState<FilePreview[]>(() =>
    transformDefaultValue(defaultValue)
  );

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      rejectedFiles.forEach((rejectedFile) => {
        const { file, errors } = rejectedFile;
        const error = errors[0];
        const errorMessage = (() => {
          switch (error.code as ErrorCode) {
            case ErrorCode.FILE_TOO_LARGE:
              return errorMessages[ErrorCode.FILE_TOO_LARGE](file, rest.maxSize);
            case ErrorCode.FILE_TOO_SMALL:
              return errorMessages[ErrorCode.FILE_TOO_SMALL](file, rest.minSize);
            case ErrorCode.TOO_MANY_FILES:
              return errorMessages[ErrorCode.TOO_MANY_FILES](rest.maxFiles);
            case ErrorCode.FILE_INVALID_TYPE:
              return errorMessages[ErrorCode.FILE_INVALID_TYPE](file);
            default:
              return `There was a problem uploading ${file.name}.`;
          }
        })();
          rest.onError?.(errorMessage);
      });
      return;
    }
  
    setFileList((prev) => [...prev, ...acceptedFiles]);
    onChange?.(acceptedFiles);
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    ...rest,
  });

  return {
    getRootProps,
    getInputProps,
    fileList,
  };
}
