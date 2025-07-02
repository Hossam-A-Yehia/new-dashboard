import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CustomImage from '../../../components/atoms/Image/CustomImage';
import LOGO from '@/assets/images/Sidebar-logo.png';
import LanguageDropdown from './LanguageDropdown';
import FullScreenDropdown from './FullScreenDropdown';
import ProfileDropdown from './ProfileDropdown';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginInlineStart: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface HeaderProps {
  onMenuClick: () => void;
  isDrawerOpen: boolean;
}

export default function Header({ onMenuClick, isDrawerOpen }: HeaderProps) {
  return (
    <AppBar
      style={{ background: '#fff', boxShadow: 'none' }}
      position="fixed"
      open={isDrawerOpen}
      className="border-b max-h-[64.5px]"
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{
            marginInlineEnd: 5,
            ...(isDrawerOpen && { display: 'none' }),
          }}
          className="text-black"
        >
          <MenuIcon />
        </IconButton>
        <div className="flex items-center justify-between w-full">
          <div>
            <CustomImage src={LOGO} width={200} height={200} alt="Logo" />
          </div>
          <div className="flex items-center">
            <LanguageDropdown />
            <FullScreenDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}
