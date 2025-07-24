import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function formatSize(bytes: number): string {
    
    if(bytes==0) return "0 B";
    const k=1024;
    const sizes=["B","KB","MB","GB","TB","PB","EB","ZB","YB"];

    const i=Math.floor(Math.log(bytes)/Math.log(k));
    return parseFloat((bytes/k**i).toFixed(2))+" "+sizes[i];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateUUID = () => crypto.randomUUID();