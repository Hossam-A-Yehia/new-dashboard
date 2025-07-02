import { useFileUploader } from '@/hooks/useFileUploader';
import { MdOutlineModeEdit } from 'react-icons/md';

const CoverUpload = ({
  setFieldValue,
  name,
  defaultValue,
  defaultImage,
}: {
  setFieldValue: any;
  name: string;
  defaultValue?: File | null;
  defaultImage?: string;
}) => {
  const { getInputProps, getRootProps, fileList } = useFileUploader({
    onChange: (files) => {
      setFieldValue(name, files[0]);
    },
    accept: {
      image: ['.jpg', '.jpeg', '.png'],
    },
    maxSize: 2 * 1024 * 1024,
    defaultValue,
  });
  const previewImage = fileList[0]?.preview || defaultImage || '/profile.png';
  return (
    <div className="relative size-[100px]" data-testid="profile">
      <img
        className="object-cover w-full h-full rounded-full"
        src={previewImage}
        alt="Cover preview"
      />
      <div {...getRootProps()} className="absolute right-0 flex items-center justify-center top-16">
        
        <input data-testid="input-for-cover" {...getInputProps()} />
          <button type="button" className='p-2 rounded-full bg-main'  >
            <MdOutlineModeEdit className="text-sm text-white" />
          </button>
      </div>
    </div>
  );
};

export default CoverUpload;
