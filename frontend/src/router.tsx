import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import { Loading } from "@/components/native/Loading";
import type { AppRouter } from "../../backend/src/routes/router";
import { GetTelegramUser } from "./lib/utils";

export const queryClient = new QueryClient();

export const trpc = createTRPCReact<AppRouter>({});

export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: `${import.meta.env.VITE_API_URL}/trpc`,
            headers: (opts) => {
                return {
                    Authorization: "tma " + window.Telegram.WebApp.initData,
                };
            },
        }),
    ],
});

export const trpcQueryUtils = createTRPCQueryUtils({
    queryClient,
    client: trpcClient,
});

export type RouterContext = {
    trpcQueryUtils: typeof trpcQueryUtils;
    webApp: typeof window.Telegram.WebApp;
    telegramUser: WebAppUser | undefined;
};

export const router = createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
        trpcQueryUtils,
        webApp: window.Telegram.WebApp,
        telegramUser: GetTelegramUser(window.Telegram.WebApp),
    },
    defaultPendingComponent: () => <Loading fullScreen={true} />,
    Wrap: function WrapComponent({ children }) {
        return (
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </trpc.Provider>
        );
    },
});

window.Telegram.WebApp.BackButton.onClick(() => {    
    if (router.latestLocation.pathname === "/") {
        window.Telegram.WebApp.BackButton.hide()
    } else {
        router.history.back()
    }
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
