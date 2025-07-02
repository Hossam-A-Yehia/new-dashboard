import Button from "@/components/atoms/Button/Button";
import React from "react";
import { useTranslation } from "react-i18next";
import { BiFile, BiX } from "react-icons/bi";

interface FileWithError {
  file: File;
  error?: string;
}

interface FileUploadSectionProps {
  uploadedFiles: FileWithError[];
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  uploadedFiles,
  handleFileChange,
  removeFile,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full p-6 border-2 border-dashed rounded-lg shadow-sm bg-gray-50">
        <div className="flex flex-col items-center justify-center gap-3">
          <input
            data-testid="file-input"
            type="file"
            id="documents"
            name="documents"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <label
            htmlFor="documents"
            className="px-5 py-3 text-sm font-semibold text-center  bg-white border border-gray-300 rounded-md shadow-md cursor-pointer hover:bg-slate-200 duration-300"
          >
            {t("rfq.upload_file.upload_file")}
          </label>
          <div className="text-xs text-gray-500">
            {t("rfq.upload_file.allowed_files")}
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="flex flex-col gap-4">
          {uploadedFiles.map((fileObj, index) => (
            <div
              key={`${fileObj.file.name}-${index}`}
              className={`flex items-center gap-4 p-4 rounded-lg shadow-sm transition ${
                fileObj.error
                  ? "bg-red-50 border border-red-300"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-500">
                <BiFile size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {fileObj.file.name}
                </div>
                {fileObj.error ? (
                  <div className="mt-1 text-xs text-red-600">
                    {fileObj.error}
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-green-500">Done</div>
                )}
              </div>{" "}
              <div className="w-fit">
                <Button
                  type="button"
                  variant="delete"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${fileObj.file.name}`}
                >
                  <BiX size={20} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
