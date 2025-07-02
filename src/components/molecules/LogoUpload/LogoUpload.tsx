import { useFileUploader } from "@/hooks/useFileUploader";
import { MdOutlineModeEdit } from "react-icons/md";

const LogoUpload = ({
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
      image: [".jpg", ".jpeg", ".png"],
    },
    maxSize: 2 * 1024 * 1024,
    defaultValue,
  });

  const previewImage =
    fileList[0]?.preview || defaultImage || "/default-logo.png";

  return (
    <div className="flex justify-center " data-testid="logo">
      <div className="size-[100px] relative rounded-full border-[2px] border-[#F05B204A]">
        {" "}
        <div className="w-full h-full overflow-hidden rounded-full ">
          <img className="object-cover w-full h-full" src={previewImage} />
        </div>
        <div {...getRootProps()} className="absolute right-0 flex items-center justify-center top-16">
        <input data-testid="input-for-logo" {...getInputProps()} />
          <button type="button" className='p-2 rounded-full bg-main'  >
            <MdOutlineModeEdit className="text-sm text-white" />
          </button>
      </div>
      </div>
    </div>
  );
};

export default LogoUpload;
