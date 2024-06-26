import { cn } from '@lib/utils'
import type { FC, HTMLAttributes, PropsWithChildren } from 'react'

interface SideBarItemsProps extends HTMLAttributes<HTMLUListElement> {}

export const Items: FC<PropsWithChildren<SideBarItemsProps>> = ({
	children,
	className,
	...props
}) => {
	return (
		<ul
			className={cn(
				'flex flex-row md:flex-col gap-y-8 items-center justify-between md:justify-center',
				'h-full',
				className
			)}
			{...props}
		>
			{children}
		</ul>
	)
}
