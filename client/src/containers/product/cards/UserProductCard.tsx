import type {FC} from 'react';
import type {ProductFullest} from "@/types/product.interface";
import Image from "next/image";
import {cn} from "@lib/utils";
import {Card} from "@common/Card";
import {useRouter} from "next/router";
import {Button} from "@ui/Button";
import {Edit} from 'lucide-react';
import {StarRating} from "@containers/product/layout/StarRating";
import {useProductRateAvg} from "@hooks/useProductRateAVG";
import {QuantityBadge} from "@containers/product/layout/QuantityBadge";
import {useProfile} from "@hooks/useProfile";
import {DeleteButton} from "@containers/product/layout/DeleteButton";

interface FavoriteProductProps {
    product: ProductFullest;
    ownerId: number;
}

// TODO: Remove the absolute position
export const UserProductCard: FC<FavoriteProductProps> = ({product, ownerId}) => {
    const {profile} = useProfile();
    const router = useRouter();
    const rating = useProductRateAvg(product.id);

    return (
        <Card
            className={cn(
                "relative flex flex-col justify-start md:flex-row md:items-center my-0 mx-auto border mt-4 rounded-lg shadow-sm bg-popover",
                "hover:shadow-xl hover:bg-muted transition-all duration-200 border h-fit md:h-[100px] p-2 md:p-0", {
                    "opacity-90": !product.quantity,
                }
            )}
        >
            <Image
                className="float-left rounded-lg md:rounded-l-lg h-[64px] w-[64px] md:h-full md:w-auto cursor-pointer"
                src={product.images[0]}
                alt={"product image"}
                width={128}
                height={128}
                onClick={() => router.push(`/products/${product.slug}`)}
            />
            <div
                className="md:w-3/12 w-7/12 ml-4 absolute left-[64px] md:static cursor-pointer"
                onClick={() => router.push(`/products/${product.slug}`)}
            >
                <div className="flex">
                    <p className="hover:underline transition-all">
                        {/* TEMP Bad thing */}
                        {product.name.length > 22 ? product.name.slice(0, 26).concat("..") : product.name}
                    </p>
                    <QuantityBadge quantity={product.quantity}/>
                </div>
                {/* TEMP Bad thing */}
                <p className="text-xs">{product.description?.slice(0, 56).concat("..")}</p>
            </div>
            <StarRating className="mt-2 md:mt-0" rating={rating}/>

            {
                profile?.id === ownerId &&
                <>
                    <Button
                        className="ml-auto mt-2 md:mt-0 w-full md:w-fit"
                        onClick={() => router.push(`/products/workshop/${product.id}`)}
                    >
                        <Edit/>
                        <p className="ml-2">Edit</p>
                    </Button>
                    <DeleteButton
                        className="hidden md:block mx-4"
                        variant="secondary"
                        productId={product.id}
                    />
                </>
            }
        </Card>
    );
};