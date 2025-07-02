import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, IconButton, Typography, Tooltip, Box } from '@mui/material';
import i18n from '@/il8n';
import languages from '@/common/languages';

interface Language {
  label: string;
  flag: string;
}

interface Languages {
  [key: string]: Language;
  en: Language;
  ar: Language;
}

const typedLanguages = languages as Languages;

const LanguageDropdown: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<keyof Languages>('en');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isLanguageDropdownOpen = Boolean(anchorEl);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('I18N_LANGUAGE') || 'en';
    if (savedLanguage in typedLanguages) {
      setSelectedLang(savedLanguage as keyof Languages);
      i18n.changeLanguage(savedLanguage);
      document.body.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const changeLanguageAction = (lang: keyof Languages) => {
    i18n.changeLanguage(lang as string);
    localStorage.setItem('I18N_LANGUAGE', lang as string);
    setSelectedLang(lang);
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    window.location.reload();
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="ml-2" data-testid="select language">
      <Tooltip title={typedLanguages[selectedLang].label} arrow>
        <IconButton
          onClick={handleMenuOpen}
          aria-label={`Select language, current: ${typedLanguages[selectedLang].label}`}
          className="p-1 transition-transform duration-200 hover:scale-110"
          sx={{
            borderRadius: '50%',
            backgroundColor: isLanguageDropdownOpen ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.12)' },
          }}
        >
          <img
            src={typedLanguages[selectedLang].flag}
            alt={typedLanguages[selectedLang].label}
            className="object-cover w-6 h-6 rounded-full"
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={isLanguageDropdownOpen}
        onClose={handleMenuClose}
        transformOrigin={{ vertical: 'top', horizontal: i18n.language === 'ar' ? 'left' : 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: i18n.language === 'ar' ? 'left' : 'right' }}
        PaperProps={{
          className: 'py-2 mt-2 rounded-lg shadow-xl bg-white',
          sx: {
            minWidth: '180px',
            maxWidth: '240px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          },
        }}
        transitionDuration={200}
      >
        {Object.keys(typedLanguages).map((key) => (
          <MenuItem
            key={key}
            onClick={() => {
              changeLanguageAction(key as keyof Languages);
            }}
            selected={selectedLang === key}
            className="flex items-center transition-colors duration-150 hover:bg-gray-100"
            sx={{
              py: 1.5,
              px: 2,
              backgroundColor: selectedLang === key ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.12)' },
              },
            }}
          >
            <Box className="flex items-center w-full">
              <img
                src={typedLanguages[key].flag}
                alt={typedLanguages[key].label}
                className="object-cover w-5 h-5 mx-3 rounded-full"
              />
              <Typography
                variant="body2"
                className="font-medium text-gray-800"
                sx={{ flexGrow: 1 }}
              >
                {typedLanguages[key].label}
              </Typography>
              {selectedLang === key && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LanguageDropdown;
