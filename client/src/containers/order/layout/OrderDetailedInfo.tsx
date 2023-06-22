import type {FC} from 'react';
import type {Order, OrderItem} from "@/types/order.interface";
import {OrderStatus} from "@/types/order.interface";
import {useProfile} from "@hooks/useProfile";
import {priceFormat} from "@lib/formatter";
import {Button} from "@ui/Button";
import {Info, Package} from "lucide-react";
import {Accordion} from "@radix-ui/react-accordion";
import {AccordionContent, AccordionItem, AccordionTrigger} from "@common/Accordion";
import {CartReadonlyItemCard} from "@containers/cart/cards/CartReadonlyItemCard";
import {HoverInfoCard} from "@components/HoverInfoCard";
import {getShippingName} from "@lib/csc";
import {InfoRow} from "@components/InfoRow";
import Link from "next/link";
import {makeDiscount} from "@lib/utils";
import {CartDialog} from "@containers/cart/dialogs/CartDialog";

import type {CartItem} from "@/types";
import {useAppDispatch} from "@redux/store";
import {addToCart} from "@redux/cart/cart.slice";

interface OrderDetailedInfoProps {
    order: Order;
    items: OrderItem[];
}

export const OrderDetailedInfo: FC<OrderDetailedInfoProps> = ({order, items}) => {
    const {profile} = useProfile();
    const dispatch = useAppDispatch();

    if (!profile) return null;
    const price = items.reduce((prev, cur) => prev + cur.price, 0);

    const addManyToCart = () => {
        const cartItems: CartItem[] = order.items.map((item): CartItem =>
            ({...item.product, count: item.quantity})
        );
        cartItems.forEach(item => dispatch(addToCart(item)));
    }

    return (
        <main className="flex flex-col sm:flex-row gap-4 mt-4">
            <section className="w-full md:w-4/12 px-2">
                <h2 className="font-medium text-xl select-none">Order information</h2>
                <hr className="my-2"/>

                <article className="py-2 border-b">
                    <div className="flex items-center">
                        <Package className="w-5 h-5 mr-1 text-primary opacity-90"/>
                        <p>Courier to your address</p>
                    </div>
                    <p className="text-primary opacity-90 text-sm">
                        {getShippingName(order.shipping)}
                    </p>
                </article>

                <div className="mt-4">
                    <InfoRow title="Name">
                        {`${order.shipping.name} ${order.shipping.surname}`}
                    </InfoRow>
                    <InfoRow title="Phone">
                        {order.shipping.phone}
                    </InfoRow>
                    <InfoRow title="Email">
                        {profile.email}
                    </InfoRow>
                    {order.shipping.temp && (
                        <HoverInfoCard
                            title="Temp shipping method."
                            description="This is a delivery method from which data will be lost as soon as the order is completed or canceled"
                        >
                            <div
                                className="mt-4 flex space-x-1 items-start md:hover:underline transition-all cursor-pointer w-fit">
                                <p className="text-sm text-muted-foreground">Temp shipping method</p>
                                <Info className="w-3 h-3 text-primary opacity-90"/>
                            </div>
                        </HoverInfoCard>
                    )}
                </div>
            </section>
            <section className="w-full md:w-8/12 px-2">
                <Accordion type="single" collapsible>
                    <AccordionItem className="mb-4" value="description">
                        <AccordionTrigger className="font-medium text-xl select-none p-0 pb-2">Items</AccordionTrigger>
                        <AccordionContent className="max-h-[300px] overflow-y-auto rounded-lg p-4 pb-0 my-4 border">
                            {items.map(item => (
                                <CartReadonlyItemCard key={item.id} item={{...item.product, count: item.quantity}}/>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {order.payment && (
                    <InfoRow title="Payment">
                        {`*${order.payment.cardNumber.slice(16 - 4)}`}
                    </InfoRow>
                )}
                <InfoRow title="Delivery">
                    at the carrier tariffs
                </InfoRow>
                <InfoRow title="Payment status">
                    {order.payment ? "paid" : "waiting for payment"}
                </InfoRow>
                {order.promoCode && (
                    <InfoRow title="Promo-Code">
                        {`-${order.promoCode.discountPercent}%`}
                    </InfoRow>
                )}
                <InfoRow className="mt-2 text-lg" title="Amount">
                    {priceFormat(makeDiscount(price, order.promoCode?.discountPercent || 0))}
                </InfoRow>

                <div className="flex gap-2 md:gap-4 flex-col md:flex-row mt-4">
                    <HoverInfoCard
                        title="Feedback to the author"
                        description="You cannot leave feedback on an order that has not yet been completed"
                        disabled={order.status === OrderStatus.COMPLETED}
                    >
                        <div>
                            <Button
                                className="w-full"
                                variant="secondary"
                                disabled={order.status !== OrderStatus.COMPLETED}
                            >
                                <Link
                                    className="w-full md:w-auto"
                                    href={`/users/${order.items[0].product.ownerId}/#feed-back`}
                                >
                                    Leave a review
                                </Link>
                            </Button>
                        </div>
                    </HoverInfoCard>

                    <CartDialog>
                        <Button
                            className="w-full md:w-auto"
                            onClick={addManyToCart}
                        >
                            Repeat the order
                        </Button>
                    </CartDialog>
                    <Button
                        className="w-full md:w-auto md:ml-auto"
                        variant="destructive"
                        disabled={order.status !== OrderStatus.PENDING}
                    >
                        Cancel
                    </Button>
                </div>

                <footer className="flex justify-between mt-4 text-sm text-muted-foreground">
                    <p>Last update: {new Date(order.updatedAt).toLocaleDateString()}</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </footer>
            </section>
        </main>
    );
};