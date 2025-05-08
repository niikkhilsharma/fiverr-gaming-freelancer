'use client'
import { cn } from '@/lib/utils'

export default function MaxWidthWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
	return <div className={cn('container mx-auto px-4 sm:px-0 py-12 md:py-16 lg:py-20', className)}>{children}</div>
}
