import {Meta} from "@containers/Meta";
import {SideBar} from "@containers/aside/SideBar";
import {Main} from "@containers/Main";
import {Header} from "@containers/header/Header";
import {WorkShop} from "@containers/workshop/WorkShop";
import AuthProvider from "@providers/AuthProvider";
import {useRouter} from "next/router";
import {getStringFromQuery} from "@lib/utils";
import {useQuery} from "@tanstack/react-query";
import ProductService from "@api/services/product.service";

export default function Page() {
    const router = useRouter();
    const id = getStringFromQuery(router.query.id);

    const {data: product} = useQuery(['get product by id', +id], () => {
        return ProductService.getByValue("id", +id);
    }, {
        select: ({data}) => data,
    });

    if (!product && id !== "@me") return null;

    return (
        <Meta title={`Workshop ${product?.name || ""}`}>
            <AuthProvider forAuth={true}>
                <Header/>
                <SideBar/>
                <Main className="flex flex-col justify-center items-center min-h-screen-64 gap-4 relative">
                    <WorkShop product={product}/>
                </Main>
            </AuthProvider>
        </Meta>
    );
}