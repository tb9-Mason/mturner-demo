import { Button as HuiButton, ButtonProps as HuiButtonProps } from '@headlessui/react';
import clsx from 'clsx';

type ButtonSize = 'sm' | 'md';

interface ButtonProps extends HuiButtonProps {
  size?: ButtonSize;
}

export const Button = ({ children, className, size = 'md', ...rest }: ButtonProps) => {
  const defaultClasses =
    'rounded transition-colors bg-transparent border text-white data-active:bg-gray-800 data-hover:bg-gray-800 enabled:cursor-pointer disabled:opacity-50';
  const sizeClasses = {
    sm: 'px-2 py-2 text-sm',
    md: 'px-4 py-2',
  };

  return (
    <HuiButton {...rest} className={clsx(defaultClasses, sizeClasses[size], className)}>
      {children}
    </HuiButton>
  );
};
