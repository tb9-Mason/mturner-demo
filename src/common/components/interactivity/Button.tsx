import { Button as HuiButton, ButtonProps } from '@headlessui/react';

export const Button = ({ children, ...rest }: ButtonProps) => {
  return (
    <HuiButton
      {...rest}
      className="rounded transition-colors bg-transparent border px-4 py-2 text-white data-active:bg-gray-800 data-hover:bg-gray-800 enabled:cursor-pointer disabled:opacity-50"
    >
      {children}
    </HuiButton>
  );
};
