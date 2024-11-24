import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { router } from "./router";

import "./css/app.css";

// const router = createRouter();

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}
