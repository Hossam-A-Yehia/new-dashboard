import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const FullScreenDropdown: React.FC = () => {
  const [isFullScreenMode, setIsFullScreenMode] = useState(true);

  const toggleFullscreen = () => {
    const doc = window.document;
    const docEl = doc.documentElement;

    doc.body.classList.add('fullscreen-enable');

    if (
      !doc.fullscreenElement &&
      !doc.fullscreenElement &&
      !doc.fullscreenElement &&
      !doc.fullscreenElement
    ) {
      setIsFullScreenMode(false);

      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if ((docEl as any).mozRequestFullScreen) {
        (docEl as any).mozRequestFullScreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        (docEl as any).webkitRequestFullscreen();
      } else if ((docEl as any).msRequestFullscreen) {
        (docEl as any).msRequestFullscreen();
      }
    } else {
      setIsFullScreenMode(true);

      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if ((doc as any).mozCancelFullScreen) {
        (doc as any).mozCancelFullScreen();
      } else if ((doc as any).webkitCancelFullScreen) {
        (doc as any).webkitCancelFullScreen();
      } else if ((doc as any).msExitFullscreen) {
        (doc as any).msExitFullscreen();
      }
    }

    const exitHandler = () => {
      if (
        !doc.fullscreenElement &&
        !doc.exitFullscreen &&
        !doc.fullscreen &&
        !doc.fullscreenElement
      ) {
        doc.body.classList.remove('fullscreen-enable');
      }
    };

    doc.addEventListener('fullscreenchange', exitHandler);
    doc.addEventListener('webkitfullscreenchange', exitHandler);
    doc.addEventListener('mozfullscreenchange', exitHandler);
    doc.addEventListener('MSFullscreenChange', exitHandler);
  };

  return (
    <div className="items-center hidden ms-1 sm:flex" data-testid="fullscreen-icon">
      <Tooltip title={isFullScreenMode ? 'Enter Fullscreen' : 'Exit Fullscreen'}>
        <IconButton
          onClick={toggleFullscreen}
          className="text-gray-600 rounded-full hover:text-black"
          size="large"
        >
          {isFullScreenMode ? <FullscreenIcon fontSize="medium" /> : <FullscreenExitIcon fontSize="medium" />}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default FullScreenDropdown;
