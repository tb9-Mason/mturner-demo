import { forwardRef } from 'react';
import { Select as HuiSelect, SelectProps } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, ...rest }: SelectProps, ref) => {
    return (
      <div className="relative">
        <HuiSelect
          ref={ref}
          {...rest}
          className={`block w-full appearance-none rounded-lg border bg-white/5 px-3 py-1.5 text-white focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 *:text-black ${className}`}
        >
          {children}
        </HuiSelect>
        <ChevronDownIcon
          className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
          aria-hidden="true"
        />
      </div>
    );
  },
);
