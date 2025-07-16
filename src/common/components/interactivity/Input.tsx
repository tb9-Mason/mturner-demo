import { forwardRef } from 'react';
import { Input as HuiInput, InputProps } from '@headlessui/react';
import clsx from 'clsx';

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...rest }: InputProps, ref) => {
  const defaultClasses =
    'block w-full rounded-lg border bg-white/5 px-3 py-1.5 text-white focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25';
  return <HuiInput {...rest} ref={ref} className={clsx(defaultClasses, className)} />;
});
