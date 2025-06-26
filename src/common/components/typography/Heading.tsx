import type { JSX, PropsWithChildren } from 'react';

interface HeadingProps extends PropsWithChildren<JSX.IntrinsicElements['h1']> {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading = ({ tag = 'h1', children, ...rest }: HeadingProps) => {
  const Tag = tag;
  return <Tag {...rest}>{children}</Tag>;
};
