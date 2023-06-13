import type {FC} from 'react';
import {Card} from "@common/Card";
import {MapPin, Info} from "lucide-react";
import Link from "next/link";
import {useProfile} from "@hooks/useProfile";

export const OrderContactsCard: FC = () => {
    const {profile} = useProfile();

    return (
        <Card className="bg-popover p-4 flex items-center hover:shadow-lg transition-all">
            <MapPin className="w-8 h-8 opacity-90 mr-2"/>
            <div>
                <p className="text-xs opacity-90">Automate form filling!</p>
                <div className="flex hover:underline transition-all cursor-pointer">
                    <p className="font-medium">Give us access to your location</p>
                    <Info className="w-4 h-4 ml-1 hidden md:block opacity-90 text-primary" />
                </div>
            </div>
            {profile && (
                <Link
                    href={`/users/${profile.id}`}
                    className="ml-auto opacity-90 md:hover:underline transition-all text-sm"
                >
                    Give access
                </Link>
            )}
        </Card>
    );
};