import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import React from 'react';

const cacheRtl = createCache({
  key: 'mui-rtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'mui-ltr',
});

const theme = createTheme({
  direction: 'ltr',
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode; isRtl: boolean }> = ({
  children,
  isRtl,
}) => {
  const direction = isRtl ? 'rtl' : 'ltr';
  const updatedTheme = createTheme({
    ...theme,
    direction,
  });

  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={updatedTheme}>{children}</ThemeProvider>
    </CacheProvider>
  );
};
