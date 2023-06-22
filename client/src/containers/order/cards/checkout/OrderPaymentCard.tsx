import type {FC} from 'react';
import {useContext, useState} from "react";
import {Card} from "@common/Card";
import {RadioGroup, RadioGroupItem} from "@common/RadioGroup";
import {Label} from "@ui/Label";
import {MagicCard} from "@containers/payment/MagicCard";
import {cn} from "@lib/utils";
import {useQuery} from "@tanstack/react-query";
import PaymentService from "@api/services/payment.service";
import Link from "next/link";
import {useProfile} from "@hooks/useProfile";
import {Info} from "lucide-react";
import {OrderCheckoutContext} from "@containers/order/CheckoutScreen";
import {HoverInfoCard} from "@components/HoverInfoCard";

export const OrderPaymentCard: FC = () => {
    const {paymentId, updateDetails} = useContext(OrderCheckoutContext);
    const {profile} = useProfile();

    const {data: payments} = useQuery(["get payments"], () => {
        return PaymentService.getAll();
    }, {
        select: ({data}) => data,
    });

    return (
        <Card className="bg-popover p-4 mt-4">
            <h2 className="font-medium text-xl mb-2">Payment:</h2>

            <RadioGroup
                defaultValue={paymentId?.toString() || "-1"}
                className="flex flex-col gap-2 ml-2 rounded-lg"
                onValueChange={(value) => updateDetails({paymentId: value === "-1" ? void 0 : +value})}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem id="receipt" value="-1"/>
                    <Label htmlFor="receipt" className="text-lg font-normal">Payment upon receipt of goods</Label>
                </div>

                {payments?.map(payment => (
                    <div key={payment.id} className={cn("transition-all rounded-lg overflow-x-auto", {
                        "border p-2": paymentId === payment.id
                    })}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem id={payment.createdAt} value={payment.id.toString()}/>
                            <Label htmlFor={payment.createdAt} className="text-lg font-normal">Magic card</Label>
                        </div>
                        {paymentId === payment.id && <MagicCard className="my-2 mx-auto" payment={payment}/>}
                    </div>
                ))}

                {(!payments?.length && profile) && (
                    <HoverInfoCard
                        title="Billing"
                        description="Optimize order creation by adding a payment method to your profile."
                    >
                        <Link
                            className={cn(
                                "mt-2 bg-white shadow-sm border border hover:border-warning hover:underline",
                                "transition-all p-2 rounded-lg text-center hidden sm:flex gap-1 justify-center"
                            )}
                            href="/profile?tab=billing"
                        >
                            <p>You do not have any payment method, add it to your profile</p>
                            <Info className="w-4 h-4 text-primary opacity-90"/>
                        </Link>
                    </HoverInfoCard>
                )}
            </RadioGroup>
        </Card>
    );
};