import { cn } from '@/lib/utils';
import { Info, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react';

type CalloutType = 'info' | 'warning' | 'tip' | 'danger';

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const calloutConfig = {
    info: {
        icon: Info,
        bgColor: 'bg-blue-950/30 border-blue-500/30',
        iconColor: 'text-blue-400',
        titleColor: 'text-blue-300',
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-950/30 border-yellow-500/30',
        iconColor: 'text-yellow-400',
        titleColor: 'text-yellow-300',
    },
    tip: {
        icon: Lightbulb,
        bgColor: 'bg-green-950/30 border-green-500/30',
        iconColor: 'text-green-400',
        titleColor: 'text-green-300',
    },
    danger: {
        icon: AlertCircle,
        bgColor: 'bg-red-950/30 border-red-500/30',
        iconColor: 'text-red-400',
        titleColor: 'text-red-300',
    },
};

export function Callout({
    type = 'info',
    title,
    children,
    className,
}: CalloutProps) {
    const config = calloutConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                'my-6 rounded-lg border-l-4 p-4',
                config.bgColor,
                className
            )}
        >
            <div className="flex items-start gap-3">
                <Icon className={cn('mt-0.5 h-5 w-5 flex-shrink-0', config.iconColor)} />
                <div className="flex-1">
                    {title && (
                        <p className={cn('font-semibold mb-2', config.titleColor)}>{title}</p>
                    )}
                    <div className="text-text-primary text-sm leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}