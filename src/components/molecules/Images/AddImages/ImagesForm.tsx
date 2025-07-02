import  { useRef, useState, ChangeEvent } from 'react';
import { Camera, X, Upload, Check } from 'lucide-react';
import Button from '@/components/atoms/Button/Button';
import { Form } from 'formik';
import FormField from '../../FormField/FormField';
import { useTranslation } from 'react-i18next';


export default function ImagesForm({ setModal, form, isMutatePutLoading }: any) {
  const { touched, setFieldValue, isSubmitting, errors } = form;
  const { t } = useTranslation();
  const [imageErrors, setImageErrors] = useState<string[]>([]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const newErrors: string[] = [];

    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (file.size > maxSize) {
        newErrors.push('commonImageCard.message.errorImageSize');
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width < 720 || img.height < 720) {
          newErrors.push('commonImageCard.message.errorImageResolution');
        }

        if (newErrors.length > 0) {
          setFieldValue('image', null);
          setPreviewUrl(null);
          setImageErrors(newErrors);
        } else {
          setFieldValue('image', file);
          setImageErrors([]);

          const reader = new FileReader();
          reader.onload = () => {
            setPreviewUrl(reader.result as string);
          };
          reader.readAsDataURL(file);
        }

        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        setFieldValue('image', null);
        setPreviewUrl(null);
        setImageErrors([t('commonImageCard.message.invalidImageFile')]);
      };

      img.src = objectUrl;
    }
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className="mx-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {t("commonImageCard.uploadImage")}
          </h2>
      </div>

      <Form>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="md:col-span-2">
              <div className="flex flex-col items-center">
                {previewUrl ? (
                  <div className="relative w-full max-w-sm mb-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFieldValue('image', null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X size={16} className="text-gray-700" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-sm h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors mb-4"
                  >
                    <Camera size={36} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {t("commonImageCard.clickToUploadImage")}
                      </p>
                    <p className="text-s text-gray-400 mt-1 text-center">
                      {t("commonImageCard.filesAllowed")}
                      </p>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/gif, image/jpeg"
                  className="hidden"
                />

                {previewUrl ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Upload size={16} className="mr-1" />
                    {t("commonImageCard.replace")}
                  </button>
                ) : errors.image && imageErrors.length === 0 ? (
                  <p className="text-md font-semibold text-red-500 mt-1">{errors.image}</p>
                ) : null}
              </div>
              {imageErrors.length > 0 && (
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                  {imageErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="md:col-span-2 flex flex-col gap-4 md:flex-row">
              {/* Title */}
              <FormField
                additionalClasses="w-full"
                dataTestid="title"
                id="title"
                label={t('commonImageCard.form.title')}
                type="text"
                name="title"
                placeholder={t('commonImageCard.form.titlePlaceholder')}
                touched={touched.title}
                errors={errors.title}
              />

              {/* Alt Text */}
              <FormField
                additionalClasses="w-full"
                dataTestid="alt"
                id="alt"
                label={t('commonImageCard.form.altText')}
                type="text"
                name="alt"
                placeholder={t('commonImageCard.form.altTextPlaceholder')}
                touched={touched.alt}
                errors={errors.alt}
              />
              {/* Caption */}
              <FormField
                additionalClasses="w-full"
                dataTestid="caption"
                id="caption"
                label={t('commonImageCard.form.caption')}
                type="text"
                name="caption"
                placeholder={t('commonImageCard.form.captionPlaceholder')}
                touched={touched.caption}
                errors={errors.caption}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {t('commonImageCard.form.close')}
          </button>
          <div>
                      <Button variant="main" type="submit" disabled={isSubmitting || isMutatePutLoading}>
            {isSubmitting || isMutatePutLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
               {t('commonImageCard.form.saving')}
              </>
            ) : (
              <>
                <Check size={16} className="mr-1" />
               {t('commonImageCard.form.save')}
              </>
            )}
          </Button>

          </div>
        </div>
      </Form>
    </div>
  );
}
