import {  Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Index from './Images';

interface ImageModalWrapperProps {
  imageable_id: string | number;
  imageable_type: string;
  HideAddPart?: boolean;
  isModalOpen:boolean,
  toggleModal:any,
  setIsModalOpen:any
}

export const ImageModalWrapper: React.FC<ImageModalWrapperProps> = ({
  imageable_id,
  imageable_type,
  HideAddPart = false,
  isModalOpen,
  toggleModal,
  setIsModalOpen
}) => {
  const { t } = useTranslation();

  return (
      <div >
        <Dialog
          open={isModalOpen}
          onClose={toggleModal}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            className: "rounded-lg shadow-lg",
          }}
        >
          <DialogTitle className="bg-gray-100 border-b p-4 relative">
            {t('commonImageCard.manageImages')}
          </DialogTitle>
          <DialogContent className="p-6">
            <Index
              setModal={setIsModalOpen}
              toggle={toggleModal}
              imageable_id={imageable_id}
              imageable_type={imageable_type}
              HideAddPart={HideAddPart}
            />
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default ImageModalWrapper;