import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names or conditional class names into a single string
 * Uses clsx for conditional classes and tailwind-merge to handle Tailwind CSS class conflicts
 * 
 * @example
 * // Basic usage
 * cn("text-red-500", "bg-blue-500")
 * 
 * @example
 * // Conditional classes
 * cn("text-white", isActive && "bg-blue-500", !isActive && "bg-gray-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
