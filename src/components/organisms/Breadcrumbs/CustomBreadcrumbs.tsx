import React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import './customBreadcrumbs.css';
import { Link } from 'react-router-dom';
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CustomBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({ items }) => {
  const lastIndex = items.length - 1;
  const title = items[lastIndex]?.label || '';

  return (
    <div className="flex flex-col gap-2 ">
      <Typography variant="h1" sx={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
        {title}
      </Typography>

      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {items.map((item, index) =>
          index === lastIndex ? (
            <Typography
              key={index}
              variant="body2"
              className="flex items-center font-bold text-main"
            >
              {item.label}
            </Typography>
          ) : (
            <Link
              key={index}
              to={item.href || '#'}
              className="flex items-center font-medium text-sm  hover:text-main-hover"
            >
              {item.label}
            </Link>
          ),
        )}
      </Breadcrumbs>
    </div>
  );
};
