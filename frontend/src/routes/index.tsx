import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";

export const Route = createFileRoute("/")({
    component: HomeComponent,
});

function HomeComponent() {

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <img
                className="w-[140px] mt-48"
                src="/assets/img/panda-face-transparent.png"
                alt="Panda is here"
            />

            <div className="flex items-center gap-2 mt-3">
                <h3 className="text-4xl font-bold">20,000</h3>
                <span>bamboos</span>
            </div>

            <pre className="mt-2 bg-secondary whitespace-pre-line"></pre>
        </div>
    );
}
