import { useLanguage } from '@/hooks/useLanguage';
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CategoriesList = ({ categories }: { categories: any[] }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { t } = useTranslation();
    const open = Boolean(anchorEl);
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const lang = useLanguage()
  
    return (
      <div>
        <Button
          variant="outlined"
          size="small"
          color="info"
          onClick={handleClick}
          endIcon={<i className="ri-arrow-down-s-line"></i>}
          sx={{ textTransform: 'none' }}
          aria-label={t('common.categories.title')}
        >
          {t('common.categories.title')} ({categories.length})
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 300,
              width: '250px',
            },
          }}
        >
          <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>{t('common.categories.title')}</Typography>
          <Divider />
          {categories.length ? (
            categories.map((category) => (
              <MenuItem key={category.id} onClick={handleClose}>
                <ListItemIcon>
                  <Check fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  {category[`name_${lang}`]}
                </ListItemText>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <ListItemText>{t('common.categories.no_categories')}</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </div>
    );
  };
export default CategoriesList;
