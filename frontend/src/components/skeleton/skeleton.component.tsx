import { cx, DefaultProps, PolymorphicComponentPropsWithRef, PolymorphicRef } from '@sk-web-gui/react';
import React from 'react';

type SkeletonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, DefaultProps>;

export const Skeleton = React.forwardRef(
  <C extends React.ElementType = 'div'>(props: SkeletonProps<C>, ref: React.Ref<PolymorphicRef<C>>) => {
    const { as: Comp = 'div', className, children = 'laddar', ...rest } = props;
    return (
      <Comp ref={ref} className={cx(className, 'skeleton rounded-utility-sm items-center')} aria-busy="true" {...rest}>
        {children}
      </Comp>
    );
  }
);

Skeleton.displayName = 'Skeleton';
