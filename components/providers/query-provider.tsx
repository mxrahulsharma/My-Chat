"use client";

import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider = ({
    children 

}: {
    children: React.ReactNode;
}) => 
    {
    const [quaryClient] = useState(() => new QueryClient());
    return(
        <QueryClientProvider client={quaryClient}>
            {children}
        </QueryClientProvider>
    )
}






