import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchImages, useMutateAddMultiImages } from '@/hooks/image';
import { MAX_FILE_SIZE } from '@/constants/Constants';
import Images from './Images/Images';
import NoUserImages from './NoUserImages/NoUserImages';

interface UserGalleryProps {
  userId: number;
}

interface FileWithPreview extends File {
  preview: string;
  formattedSize: string;
}

const MAX_WIDTH = 720;
const MAX_HEIGHT = 720;

const UserGallery: React.FC<UserGalleryProps> = ({ userId }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const { mutateAsync, isPending: isUploading } = useMutateAddMultiImages();
  const { data, isLoading } = useFetchImages({
    params: [
      { key: 'filters[imageable_type][$eq]', value: 'App\\Models\\User' },
      { key: 'filters[imageable_id][$eq]', value: userId },
    ],
  });
  const userImages = data?.data?.payload?.data || [];

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the maximum size of ${formatBytes(MAX_FILE_SIZE)}`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width >= MAX_WIDTH && img.height >= MAX_HEIGHT) {
            const formattedFile = Object.assign(file, {
              preview: URL.createObjectURL(file),
              formattedSize: formatBytes(file.size),
            });
            setSelectedFiles((prev) => [...prev, formattedFile]);
          } else {
            toast.error(
              `"${file.name}" dimensions too small. Minimum ${MAX_WIDTH}x${MAX_HEIGHT}px required.`,
            );
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => handleFiles(acceptedFiles),
    accept: { 'image/*': [] },
    maxSize: MAX_FILE_SIZE,
  });

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: { [x: string]: string | Blob; }, { resetForm, setErrors }: any) => {
    const structuredData = selectedFiles.map((file) => {
      return {
        title: "missing",
        alt: "missing",
        caption: "missing",
        image: file,
      };
    });
    const formData = new FormData();
    structuredData.forEach((data, index) => {
      Object.keys(data).forEach((key) => {
        if (key === "image") {
          formData.append(`images[${index}][${key}]`, data[key]);
        } else {
          formData.append(`images[${index}][${key}]`, values[key]);
        }
      });
      formData.append(`imageable_id`, userId.toString());
      formData.append(`imageable_type`, "App\\Models\\User");
    });
    mutateAsync(formData)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["images"] });
        toast.info(t("Image Updated Successfully!"));
        resetForm();
        setSelectedFiles([]);
      })
      .catch((err) => {
        if (err?.response?.data?.errors) {
          setErrors(err?.response?.data?.errors);
        } else {
          toast.error(t(err.response.data.message));
        }
        return err;
      });
  };

  return (
    <div >
      <div className="bg-white rounded-xl overflow-hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('userGallary.your_gallary')}</h2>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit({}, { resetForm: () => {}, setErrors: () => {} });
            }}
          >
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-main'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 mb-4 text-main">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? t('userGallary.uploadImages.dropImageHere') : t('userGallary.uploadImages.dragAndDropImageHere')}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t('userGallary.uploadImages.or')} <span className="text-main font-medium">{t('userGallary.uploadImages.browseFiles')}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {t('userGallary.uploadImages.filesAllowed')}
                </p>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    {t('userGallary.uploadImages.selectedImages')} ({selectedFiles.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    className="text-sm text-red-500 hover:text-red-700 transition"
                  >
                    {t('userGallary.uploadImages.clearAllBtn')}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{file.formattedSize}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`px-6 py-2.5 rounded-lg font-medium transition ${
                      isUploading
                        ? 'bg-blue-300 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('userGallary.uploadImages.uploading')}
                      </div>
                    ) : (
                      t('userGallary.uploadImages.uploadImageBtn')
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="mt-12">        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : userImages.length > 0 ? (
          <Images userImages={userImages} isLoading={isLoading} />
        ) : (
          <NoUserImages />
        )}
      </div>
    </div>
  );
};

export default UserGallery;