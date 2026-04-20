import * as MuiIcons from '@mui/icons-material';

interface BookIconProps {
  iconName?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function BookIcon({ iconName = 'Book', size = 'medium', className = '' }: BookIconProps) {
  // Map size to actual pixel values
  const sizeMap = {
    small: 48,
    medium: 64,
    large: 96,
  };

  // Get the icon component from MUI Icons, fallback to Book if not found
  const IconComponent = (MuiIcons as any)[iconName] || MuiIcons.Book;

  return (
    <IconComponent
      sx={{ fontSize: sizeMap[size] }}
      className={className}
    />
  );
}
