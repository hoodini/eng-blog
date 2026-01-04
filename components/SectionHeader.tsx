import React from 'react';

interface SectionHeaderProps {
    title: string;
    action?: {
        label: string;
        href: string;
    };
}

export default function SectionHeader({ title, action }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between py-8 border-b border-[var(--card-border)] mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">{title}</h2>
            {action && (
                <a
                    href={action.href}
                    className="text-[#0071e3] text-sm font-medium hover:underline flex items-center gap-1"
                >
                    {action.label} <span className="text-lg">›</span>
                </a>
            )}
        </div>
    );
}
