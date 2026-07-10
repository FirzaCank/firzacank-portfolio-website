"use client";

import dynamic from "next/dynamic";

// Keeps framer-motion + react-markdown out of the initial bundle of every
// route: the widget chunk loads async after hydration instead.
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default ChatWidget;
