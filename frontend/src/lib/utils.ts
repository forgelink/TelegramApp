import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function GetTelegramUser(webApp: WebApp): WebAppUser | undefined {
    try {
        const data = webApp.initData === "" ? "{}" : webApp.initData;
        let parsedData = JSON.parse(
            '{"' + data.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
            function (key, value) {
                return key === "" ? value : decodeURIComponent(value);
            }
        );

        const user: WebAppUser = JSON.parse(parsedData.user);

        return user;
    } catch (e) {
        return undefined;
    }
}
