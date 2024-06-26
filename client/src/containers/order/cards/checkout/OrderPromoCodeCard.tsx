import PromoCodeService from '@api/services/promo-code.service'
import { MCard } from '@common/Card'
import { buildToast, useToast } from '@common/toast/useToast'
import { transformBottomY } from '@lib/animations'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useState } from 'react'

import { FormInput } from '@components/FormInput'

import { Button } from '@ui/Button'

import type { PromoCode } from '@/types/promo-code.interface'

interface OrderPromoCodeCard {
	promo: PromoCode | null
	setPromo: Dispatch<SetStateAction<PromoCode | null>>
}

export const OrderPromoCodeCard: FC<OrderPromoCodeCard> = ({
	promo,
	setPromo
}) => {
	const [error, setError] = useState('')
	const [value, setValue] = useState('')
	const { toast } = useToast()

	const { mutate, isLoading } = useMutation(
		['find promo', value],
		() => {
			return PromoCodeService.findOne(value)
		},
		{
			onError: err => {
				if (isAxiosError(err)) {
					setError(
						err.response?.data?.message || 'Unhandled error occurred (promo)'
					)
				}
			},
			onSuccess: ({ data }) => {
				toast(buildToast('promoCode.success', { promoName: data.name }).toast)
				setPromo(data)
			},
			onSettled: () => {
				setValue('')
			}
		}
	)

	return (
		<MCard
			className='bg-popover px-6 sm:px-4 pb-4 rounded-lg border'
			initial='initial'
			animate='animate'
			custom={1}
			variants={transformBottomY}
		>
			<FormInput
				className='bg-white'
				label='Promo-code'
				value={value || promo?.name || ''}
				onChange={({ target }) => setValue(target.value.toUpperCase())}
				error={error}
				placeholder='SUMMER2023'
				disabled={!!promo}
			/>
			<Button
				className='my-2 w-full flex'
				onClick={() => {
					if (!value) return
					mutate()
				}}
				disabled={isLoading || !!promo}
			>
				{isLoading && <Loader2 className='w-5 h-5 mr-2 animate-spin' />}
				<p>Apply</p>
			</Button>
			{!!promo && (
				<p
					className='text-xs text-muted-foreground md:hover:underline cursor-pointer transition-all'
					onClick={() => setPromo(null)}
				>
					Dismiss promo-code
				</p>
			)}
		</MCard>
	)
}
