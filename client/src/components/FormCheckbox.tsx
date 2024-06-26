'use client'

import { cn } from '@lib/utils'
import type { CheckboxProps } from '@radix-ui/react-checkbox'
import { type FC, type PropsWithChildren, useId } from 'react'

import { Checkbox } from '@ui/Checkbox'

export const FormCheckbox: FC<PropsWithChildren<CheckboxProps>> = ({
	children,
	className,
	...props
}) => {
	const id = useId()
	return (
		<div className='flex items-center space-x-2'>
			<Checkbox id={id} className='float-left' {...props} />
			<label
				htmlFor={id}
				className={cn(
					'text-xs text-muted-foreground leading-none',
					'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
					className
				)}
			>
				{children}
			</label>
		</div>
	)
}
