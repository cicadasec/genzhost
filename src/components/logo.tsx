import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div
      className={cn(
        'flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary',
        className
      )}
      {...props}
    >
      <UploadCloud className="h-8 w-8" />
    </div>
  );
}
