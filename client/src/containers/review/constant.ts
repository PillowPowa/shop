import { ReviewCreate, ReviewErrors } from '@/types/review.interface'

export const STAR_REVIEWS = [
	{
		rate: 1,
		text: 'Bad'
	},
	{
		rate: 2,
		text: 'So-so'
	},
	{
		rate: 3,
		text: 'Not bad'
	},
	{
		rate: 4,
		text: 'Good'
	},
	{
		rate: 5,
		text: 'Awesome'
	}
] as const

export const INITIAL_ERRORS: ReviewErrors = {
	text: '',
	rating: ''
} as const

export const INITIAL_REVIEW: ReviewCreate = {
	text: '',
	rating: 0
} as const

export const REVIEWS_PER_PAGE: number = 5 as const
