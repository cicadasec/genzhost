import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-primary',
        className
      )}
      {...props}
    >
      <Send className="h-6 w-6" />
    </div>
  );
}
