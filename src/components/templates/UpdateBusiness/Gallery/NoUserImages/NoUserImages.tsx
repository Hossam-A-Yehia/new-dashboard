import Button from "@/components/atoms/Button/Button";
import React from "react";
import { useTranslation } from "react-i18next";

const NoUserImages: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-col items-center text-center py-12 px-6">
        <div className="mb-6 p-6 bg-blue-50 rounded-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-main" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {t("userGallary.Your_Gallery_is_Empty")}
        </h3>
        
        <p className="text-gray-600 max-w-md mb-4">
          {t("userGallary.emptyGallary")}
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 max-w-md">
          <p className="text-sm text-main">
            {t("userGallary.uploadImagesMessage")}
          </p>
        </div>
        <div className="mt-4">
        <Button
        variant="main" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {t("userGallary.uploadButton")}
        </Button>

        </div>
      </div>
    </div>
  );
};

export default NoUserImages;