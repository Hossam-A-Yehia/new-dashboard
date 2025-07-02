import React, { useState, useEffect } from 'react';
import { FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched } from 'formik';
import { X, Upload, Plus, Trash2, Move, ImageIcon, AlertCircle } from 'lucide-react';
import FormField from '../FormField/FormField';
import { useTranslation } from 'react-i18next';


type ImageType = {
  image: File | null;
  title: string;
  alt: string;
  caption: string;
  id: string;
};

type FormType = {
  values: {
    images: ImageType[];
  };
  errors: FormikErrors<{ images: ImageType[] }>;
  touched: FormikTouched<{ images: ImageType[] }>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  setFieldTouched:any
  isSubmitting?:any
};

type ImageUploadFieldProps = {
  index: number;
  form: FormType;
  isSubmitting: boolean;
};

type ImageCardProps = {
  index: number;
  form: FormType;
  remove: (index: number) => void;
  isSubmitting: boolean;
  isLast: boolean;
  oneImage?: boolean;
};

type ImageFieldArrayProps = {
  form: FormType;
  isSubmitting?: boolean;
  oneImage?: boolean;
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

const ImagePreview: React.FC<{ file: File }> = ({ file }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    setLoading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const timer = setTimeout(() => setLoading(false), 500);
    return () => {
      URL.revokeObjectURL(objectUrl);
      clearTimeout(timer);
    };
  }, [file]);

  if (!preview) return null;

  return (
    <div className="relative w-full h-56 rounded-lg overflow-hidden bg-gray-50">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-full object-cover transition-all duration-300"
        />
      )}
    </div>
  );
};

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ index, form, isSubmitting }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue(`images.${index}.image`, file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      form.setFieldValue(`images.${index}.image`, file);
    }
  };

  const image = form.values.images[index]?.image;
  const error = form.touched.images?.[index]?.image && (form.errors.images?.[index] as FormikErrors<ImageType>)?.image;

  return (
    <div className="mb-6">
      {!image ? (
        <div
          onClick={() => document.getElementById(`upload-${index}`)?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer border-2 border-dashed rounded-xl px-8 py-10 transition-all duration-200 ${
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          <div className="text-center">
            <div className="mx-auto p-4 bg-blue-100 rounded-full w-fit">
              <Upload className="w-7 h-7 text-blue-600" />
            </div>
            <p className="text-blue-600 font-medium mt-3 text-lg">{t("commonImageCard.dropImageHere")}</p>
            <p className="text-sm text-gray-500 mt-1">{t("commonImageCard.browseFiles")}</p>
            <div className="mt-3 text-xs text-gray-400 flex items-center justify-center gap-1">
              <ImageIcon className="w-3 h-3" /> {t("commonImageCard.filesAllowed")}
            </div>
          </div>
          <input
            id={`upload-${index}`}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleChange}
            disabled={isSubmitting}
            aria-label="Upload image"
          />
        </div>
      ) : (
        <div className="relative">
          <ImagePreview file={image} />
          <button
            type="button"
            onClick={() => form.setFieldValue(`images.${index}.image`, null)}
            className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label="Remove image"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="truncate text-gray-700 font-medium flex items-center">
              <ImageIcon className="w-4 h-4 mr-1.5 text-gray-500" />
              {image.name}
            </span>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              onClick={() => document.getElementById(`upload-${index}`)?.click()}
            >
              {t("commonImageCard.replace")}
            </button>
          </div>
          <input
            id={`upload-${index}`}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
      )}
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-md">
          <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" /> {error as string}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2 flex items-center">
        <AlertCircle className="w-3.5 h-3.5 mr-1 text-gray-400" />
        {t("commonImageCard.filesAllowed")}
      </p>
    </div>
  );
};

const ImageCard: React.FC<ImageCardProps> = ({
  index,
  form,
  remove,
  isSubmitting,
  oneImage,
}) => {
  const { t } = useTranslation();
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white mb-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-center px-5 py-3.5 bg-gray-50 border-b">
        <h3 className="text-gray-800 font-medium flex items-center">
          {!oneImage && (
            <div className="bg-gray-200 rounded-md p-1 mr-2.5">
              <Move className="w-4 h-4 text-gray-500" />
            </div>
          )}
          {oneImage ? t('commonImageCard.imageDetails') : t('commonImageCard.image', { index: index + 1 })}
        </h3>
        {!oneImage && (
          <button
            type="button"
            onClick={() => remove(index)}
            disabled={isSubmitting}
            className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 inline-flex items-center gap-1"
            aria-label="Remove image"
          > {t("commonImageCard.delete")}
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-5">
        <ImageUploadField
          index={index}
          form={form}
          isSubmitting={isSubmitting}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            id={`images-${index}-title`}
            name={`images.${index}.title`}
            label={t("commonImageCard.form.title")}
            placeholder={t("commonImageCard.form.titlePlaceholder")}
            required={true}
            readOnly={false}
            value={form.values.images[index].title}
            disabled={isSubmitting}
            errors={typeof form.errors.images?.[index] === 'object' ? (form.errors.images[index] as FormikErrors<ImageType>)?.title : undefined}
            touched={form.touched.images?.[index]?.title}
          />
          <FormField
            id={`images-${index}-alt`}
            name={`images.${index}.alt`}
            label={t("commonImageCard.form.altText")}
            placeholder={t("commonImageCard.form.altTextPlaceholder")}
            required={false}
            readOnly={false}
            value={form.values.images[index].alt}
            disabled={isSubmitting}
            errors={typeof form.errors.images?.[index] === 'object' ? (form.errors.images[index] as FormikErrors<ImageType>)?.alt : undefined}
            touched={form.touched.images?.[index]?.alt}
          />
          <div className="md:col-span-2">
            <FormField
              id={`images-${index}-caption`}
              name={`images.${index}.caption`}
              label={t("commonImageCard.form.caption")}
              placeholder={t("commonImageCard.form.captionPlaceholder")}
              required={false}
              readOnly={false}
              value={form.values.images[index].caption}
              disabled={isSubmitting}
              errors={typeof form.errors.images?.[index] === 'object' ? (form.errors.images[index] as FormikErrors<ImageType>)?.caption : undefined}
              touched={form.touched.images?.[index]?.caption}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageFieldArray: React.FC<ImageFieldArrayProps> = ({
  form,
  isSubmitting,
  oneImage = false,
}) => {
  const { t } = useTranslation();
  return(
  <FieldArray name="images">
    {({ push, remove }: FieldArrayRenderProps) => (
      <div>
        {form.values.images.map((_, index) => (
          <ImageCard
            key={form.values.images[index].id || index}
            index={index}
            form={form}
            remove={remove}
            isSubmitting={form.isSubmitting}
            isLast={index === form.values.images.length - 1}
            oneImage={oneImage}
          />
        ))}
        {!oneImage && form.values.images.length < 5 && (
          <button
            type="button"
            onClick={() => push({ image: null, title: '', alt: '', caption: '', id: generateId() })}
            className="inline-flex items-center px-5 py-2.5 font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 rounded-lg transition-all"
            disabled={isSubmitting}
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("commonImageCard.form.addAnotherImage")}
          </button>
        )}
      </div>
    )}
  </FieldArray>
  )
};

export default ImageFieldArray;