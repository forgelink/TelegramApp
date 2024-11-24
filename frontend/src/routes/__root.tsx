import * as React from "react";
import {
    Link,
    Outlet,
    createRootRouteWithContext,
} from "@tanstack/react-router";
import { type RouterContext } from "../router";
import MobileNavigation from "@/components/native/MobileNavigation";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/native/Loading";
import { trpc } from "@/router";
import { log } from "console";

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
    beforeLoad: async ({ context: { webApp } }) => {
        // Handle Authentication
    },
    loader: async ({
        location,
        context: { telegramUser, trpcQueryUtils, webApp },
    }) => {
        // Show back button if not on root page
        if (location.pathname === "/") webApp.BackButton.hide();
        else webApp.BackButton.show();

        return { telegramUser };
    },
});

function RootComponent() {
    const { telegramUser } = Route.useLoaderData();

    const { data, isLoading } = trpc.users.me.useQuery();
    const res = trpc.hello.useQuery({name: "There"}).data;

    console.log("Trpc resu", data);
    

    if (telegramUser === undefined) {
        return (
            <div className="h-screen flex flex-col gap-3 items-center justify-center text-center">
                <img
                    className="w-[140px]"
                    src="/assets/img/panda-face-transparent.png"
                    alt="Panda is here"
                />
                <h1 className="text-3xl text-destructive">Access Denied</h1>
                <p>Please open Panda Party using your Telegram!</p>
            </div>
        );
    }

    return (
        <>
            <div className="container">
                <hr className="mb-5" />
                <header className="flex items-center justify-between">
                    <img
                        className="w-[45px] rounded-full border-2 border-secondary"
                        src={telegramUser.photo_url}
                        alt={telegramUser.username ?? telegramUser.first_name}
                    />
                    <Badge
                        className="text-base rounded-full text-white"
                        variant={"default"}
                    >
                        20,000 $BAMBOS
                    </Badge>
                </header>
                <Outlet />
            </div>
            <MobileNavigation />
        </>
    );
}
