"use client"; 
import { useEffect } from "react"; 
import { useRouter } from 'next/navigation'; 
export default function PopStateHandler() 
{ 
    const router = useRouter(); useEffect(() => 
    { 
        const handlePopState = () => 
        { 
            window.location.href = "/game";
        };
     window.addEventListener("popstate", handlePopState); }, [router]);
    return null; 
}