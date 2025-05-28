import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const ContainerWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('bg-white p-6 rounded-lg shadow-md', className)}>
      {children}
    </div>
  );
};

export default ContainerWrapper;
