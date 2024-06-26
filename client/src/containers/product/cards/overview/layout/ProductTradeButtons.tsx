import { cn } from '@lib/utils'
import { Zap } from 'lucide-react'
import { type FC, useContext } from 'react'

import { HoverInfoCard } from '@components/HoverInfoCard'

import { BuyNowButton } from '@containers/cart/layout/BuyNowButton'
import { CartButton } from '@containers/cart/layout/CartButton'
import { OverviewProductContext } from '@containers/product/cards/overview/OverviewProductCard'
import { FavoriteButton } from '@containers/product/layout/FavoriteButton'

export const ProductTradeButtons: FC = () => {
	const product = useContext(OverviewProductContext)
	if (!product) return null

	return (
		<section
			className={cn('flex gap-4 flex-col lg:flex-row w-full', 'pt-4 md:mt-4 ')}
		>
			<HoverInfoCard
				title='The product is out of stock'
				description='Sorry, this product is out of stock'
				disabled={!!product.quantity}
			>
				<div className='w-full lg:w-1/2'>
					<BuyNowButton
						className='w-full font-medium'
						items={[{ productId: product.id, count: 1 }]}
						disabled={!product.quantity}
					>
						<Zap className='font-normal' />
						<p className='ml-2'>Buy now!</p>
					</BuyNowButton>
				</div>
			</HoverInfoCard>

			<section className='w-full lg:w-1/2 flex gap-4'>
				<CartButton className='flex-1' variant='secondary' product={product} />
				<FavoriteButton className='w-10 h-10 ml-auto' productId={product.id} />
			</section>
		</section>
	)
}
