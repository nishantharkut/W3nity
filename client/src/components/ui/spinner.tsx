import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'faded' | 'pulse' | 'dots';
    className?: string;
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
};

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    variant = 'default',
    className
}) => {
    if (variant === 'faded') {
        return (
            <div className={cn('relative', sizeClasses[size], className)}>
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 dark:border-white/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary dark:border-t-white animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/10 dark:border-white/10 animate-ping"></div>
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div className={cn('flex space-x-1', className)}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            'bg-primary dark:bg-white rounded-full animate-pulse',
                            size === 'sm' ? 'h-2 w-2' :
                                size === 'md' ? 'h-3 w-3' :
                                    size === 'lg' ? 'h-4 w-4' : 'h-5 w-5'
                        )}
                        style={{
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: '1s'
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'dots') {
        return (
            <div className={cn('flex space-x-1', className)}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            'bg-primary dark:bg-white rounded-full animate-bounce',
                            size === 'sm' ? 'h-2 w-2' :
                                size === 'md' ? 'h-3 w-3' :
                                    size === 'lg' ? 'h-4 w-4' : 'h-5 w-5'
                        )}
                        style={{
                            animationDelay: `${i * 0.16}s`,
                            animationDuration: '1.4s'
                        }}
                    />
                ))}
            </div>
        );
    }

    // Default spinner
    return (
        <div className={cn(
            'animate-spin rounded-full border-4 border-primary/20 dark:border-white/20 border-t-primary dark:border-t-white',
            sizeClasses[size],
            className
        )} />
    );
};

export const LoadingSpinner: React.FC<{
    message?: string;
    variant?: 'default' | 'faded' | 'pulse' | 'dots';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({
    message = "Loading...",
    variant = 'faded',
    size = 'lg'
}) => (
        <div className="flex flex-col items-center justify-center space-y-4">
            <Spinner variant={variant} size={size} />
            {message && (
                <p className="text-foreground text-sm font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

export const PageLoader: React.FC<{
    message?: string;
    variant?: 'default' | 'faded' | 'pulse' | 'dots';
}> = ({
    message = "Loading...",
    variant = 'faded'
}) => (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6">
                <div className="relative">
                    <Spinner variant={variant} size="xl" />
                </div>
                {message && (
                    <p className="text-foreground font-medium text-lg animate-pulse">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );

export const InlineLoader: React.FC<{
    message?: string;
    variant?: 'default' | 'faded' | 'pulse' | 'dots';
    size?: 'sm' | 'md' | 'lg';
}> = ({
    message = "Loading...",
    variant = 'faded',
    size = 'md'
}) => (
        <div className="flex items-center justify-center space-x-3 py-8">
            <Spinner variant={variant} size={size} />
            {message && (
                <span className="text-foreground text-sm font-medium">
                    {message}
                </span>
            )}
        </div>
    );
