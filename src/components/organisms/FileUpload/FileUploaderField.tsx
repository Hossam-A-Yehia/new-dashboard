import React, { useState } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import SelectInput from '@/components/molecules/SelectInput/SelectInput';
import { useFileUploader } from '@/hooks/useFileUploader';
import { FaPlus, FaFileAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { file_types } from '@/constants/Constants';
import { t } from 'i18next';

interface FileUploaderFieldProps {
  name: string;
  label: string;
  subtitle?: string;
  maxFiles?: number;
}

const FileUploaderField: React.FC<FileUploaderFieldProps> = ({
  name,
  label,
  subtitle,
  maxFiles = 5,
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const files = values[name] || [];
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFileObject = (file: any): file is File => {
    return typeof file !== 'string' && file instanceof File;
  };

  const handleAttachments = (newFiles: { file: File; type: null }[]) => {
    if (files.length + newFiles.length > maxFiles) {
      setErrorMessage(`You cannot upload more than ${maxFiles} files.`);
      return;
    }
    setErrorMessage(null);
    setFieldValue(name, [...files, ...newFiles]);
  };

  const { getInputProps, getRootProps } = useFileUploader({
    onChange: (incomingFiles: File[]) => {
      const maxSize = 2 * 1024 * 1024;
      const oversizedFiles = incomingFiles.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setErrorMessage(
          `The following files are too large: ${oversizedFiles
            .map((file) => file.name)
            .join(', ')}. The maximum size is 2MB per file.`,
        );
        return;
      }

      if (incomingFiles.length + files.length > maxFiles) {
        setErrorMessage(`You cannot upload more than ${maxFiles} files.`);
        return;
      }

      setErrorMessage(null);
      handleAttachments(
        incomingFiles.map((file) => ({
          file,
          type: null,
        })),
      );
    },
    onError: (message: any) => {
      setErrorMessage(message);
    },
    multiple: true,
    maxSize: 2 * 1024 * 1024,
    maxFiles,
  });

  const getFileIcon = (file: any) => {
    let fileName = '';

    if (isFileObject(file)) {
      fileName = file.name;
    } else if (typeof file === 'string') {
      fileName = file.split('/').pop() || '';
    }

    const extension = fileName?.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return <FaFileAlt className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileAlt className="text-blue-600" />;
      case 'txt':
        return <FaFileAlt className="text-gray-600" />;
      default:
        return <FaFileAlt className="text-main" />;
    }
  };

  const formatFileSize = (file: any) => {
    if (isFileObject(file)) {
      const size = file.size;
      if (size < 1024) return `${size} B`;
      else if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return <div>{t("UploadUserFiles.Remove_file")}</div>;
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium after:content-['*'] after:text-red-500 after:ml-0.5">
          {label}
        </h2>
        {subtitle && <h4 className="text-sm font-normal text-gray-500">{subtitle}</h4>}
      </div>

      {files?.length < maxFiles && (
        <div
          className={`w-full border-2 border-dashed rounded-lg p-4 transition-colors hover:border-main
          ${files?.length >= maxFiles ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center py-4">
            <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-main bg-opacity-10">
              <FaPlus className="text-lg text-main" />
            </div>
            <p className="font-medium text-center">
              {t("UploadUserFiles.Drag_and_drop_files_or")}
              <span className="text-main">{t("UploadUserFiles.Browse")}</span>
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {t("UploadUserFiles.Maximum")} {" "}{maxFiles} {t("UploadUserFiles.files,_up_to_2MB_per_file")}
            </p>
            {files?.length > 0 && (
              <p className="mt-1 text-sm font-medium">
                {files?.length} {t("UploadUserFiles.out_of")} {maxFiles} {t("UploadUserFiles.files_uploaded")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Display error message */}
      {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}

      <FieldArray
        name={name}
        render={({ remove }) => (
          <div className="mt-1 space-y-3">
            {files?.map(({ file }: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-sm"
              >
                <div className="flex items-center flex-1 gap-3 max-lg:flex-wrap">
                  <div className="flex items-center justify-center flex-shrink-0 p-3 bg-gray-100 rounded-md">
                    {getFileIcon(file)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {isFileObject(file)
                        ? file?.name?.length > 30
                          ? `${file.name.slice(0, 30)}...`
                          : file?.name
                        : file?.split('/').pop()}
                    </h3>
                    <p className="text-xs text-gray-500">{formatFileSize(file)}</p>
                  </div>

                  <div className="ml-auto lg:ml-4 mt-2 lg:mt-0 lg:w-auto min-w-[300px]">
                    <SelectInput
                      name={`${name}.${index}.type`}
                      options={file_types}
                      id={`${name}.${index}.type`}
                      label=""
                      placeholder={t("UploadUserFiles.Select_Type")}
                      additionalClasses="!mb-0 w-full"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  {!isFileObject(file) && (
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-1.5 text-sm text-blue-500 hover:text-white bg-white border border-blue-600 rounded-md hover:bg-blue-600 transition"
                    >
                      {t("UploadUserFiles.View")}
                    </a>
                  )}
                  {isFileObject(file) && (
                    <button
                      data-testid="Remove-file"
                      type="button"
                      onClick={() => remove(index)}
                      className="flex-shrink-0 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      aria-label={t("UploadUserFiles.Remove_file")}
                    >
                      <IoMdClose size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      />
      {files?.length === maxFiles && (
        <p className="mt-2 text-sm text-amber-600">Maximum file limit reached ({maxFiles})</p>
      )}
    </div>
  );
};

export default FileUploaderField;
