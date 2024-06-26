import { Card } from '@common/Card'
import { cn } from '@lib/utils'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

import { CartButton } from '@containers/cart/layout/CartButton'
import { ProductHorizontalInfo } from '@containers/product/cards/ProductHorizontalInfo'
import { FavoriteButton } from '@containers/product/layout/FavoriteButton'

import type { Product } from '@/types/product.interface'

interface FavoriteProductProps {
	product: Product
}

const FavoriteProductCard = forwardRef<HTMLDivElement, FavoriteProductProps>(
	({ product }, ref) => {
		return (
			<Card
				ref={ref}
				className={cn(
					'relative flex flex-col md:flex-row md:items-center my-0 mx-auto border mt-4 rounded-lg shadow-sm bg-popover',
					'hover:shadow-xl hover:bg-muted transition-all duration-200 border h-fit md:h-[100px] p-2 md:p-0',
					{
						'opacity-90': !product.quantity
					}
				)}
			>
				<ProductHorizontalInfo product={product} />
				<CartButton
					className='ml-auto mt-2 md:mt-0 w-full md:w-fit min-w-[140px]'
					product={product}
				/>
				<FavoriteButton
					className='w-10 h-10 absolute md:relative right-0 mx-4'
					productId={product.id}
				/>
			</Card>
		)
	}
)
FavoriteProductCard.displayName = 'FavoriteProductCard'
const MFavoriteProductCard = motion<FavoriteProductProps>(FavoriteProductCard)

export { FavoriteProductCard, MFavoriteProductCard }
