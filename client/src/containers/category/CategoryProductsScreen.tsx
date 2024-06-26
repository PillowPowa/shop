import ProductService from '@api/services/product.service'
import { useQuery } from '@tanstack/react-query'
import type { FC } from 'react'

import { EmptyItems } from '@containers/EmptyItems'
import { Loader } from '@containers/Loader'
import { Main } from '@containers/Main'
import { Meta } from '@containers/Meta'
import { NotFoundScreen } from '@containers/NotFoundScreen'
import * as Catalog from '@containers/product/cards/catalog'
import { Carousel } from '@containers/swiper/Carousel'

interface CategoryProductsScreenProps {
	slug: string
}

export const CategoryProductsScreen: FC<CategoryProductsScreenProps> = ({
	slug
}) => {
	const { data: products, isLoading } = useQuery(
		['get products by category', slug],
		() => {
			return ProductService.getByCategorySlug(slug)
		},
		{
			select: ({ data }) => data,
			refetchInterval: false
		}
	)

	if (!products && !isLoading) {
		return <NotFoundScreen errorMessage='Products not found' />
	}

	if ((!products && isLoading) || !slug) {
		return <Loader />
	}

	return (
		<Meta
			title={slug
				.split('-')
				.map(word => word[0].toUpperCase() + word.slice(1))
				.join(' ')}
		>
			<Main className='min-h-screen-64'>
				<Carousel />
				<section className='relative h-fit w-full flex flex-wrap gap-4 box-border'>
					{products?.length ? (
						products.map(product => (
							<Catalog.Card.MProduct key={product.id} product={product} />
						))
					) : (
						<EmptyItems className='mt-4 p-4 bg-popover rounded-lg border'>
							There are no products yet.
						</EmptyItems>
					)}
				</section>
			</Main>
		</Meta>
	)
}
