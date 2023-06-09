import type {FC} from 'react';
import {ReviewSort} from "@/types/review.interface";

import {Button} from "@ui/Button";
import {SortButtons} from "@containers/review/layout/SortButtons";
import {ReviewComment} from "@containers/review/cards/layout/ReviewComment";

import {useInfiniteQuery} from "@tanstack/react-query";
import ReviewService from "@api/services/review.service";

import {REVIEWS_PER_PAGE} from "@containers/review/constant";

interface ReviewCommentsProps {
    productId: number;
    hasAccess: boolean;
}

export const ReviewComments: FC<ReviewCommentsProps> = ({productId, hasAccess}) => {
    const fetchReviews = async (page: number) => {
        const {data} = await ReviewService.getById(productId, {
            page,
            perPage: REVIEWS_PER_PAGE,
            sort: ReviewSort.Newest
        });
        return data;
    }

    const {
        data,
        isSuccess,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(["get reviews", productId], ({pageParam = 1}) => (
        fetchReviews(pageParam)
    ), {
        getNextPageParam: (lastPage, allPages) => {
            const totalPages = Math.ceil(lastPage.length / REVIEWS_PER_PAGE);
            return totalPages > allPages.length && allPages.length + 1;
        },
    });

    return (
        <section>
            <SortButtons/>
            {isSuccess && data?.pages.map((page) => (
                page.reviews.map(review => (
                    <ReviewComment
                        key={review.id}
                        hasAccess={hasAccess}
                        review={review}
                        productId={productId}
                    />
                ))
            ))}
            {isFetchingNextPage && <h3>Loading...</h3>}
            <div className="bg-white rounded-lg w-full border text-center">
                <Button
                    className="text-primary opacity-90 cursor-pointer"
                    variant="link"
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage}
                >
                    See more
                </Button>
            </div>
        </section>
    );
};