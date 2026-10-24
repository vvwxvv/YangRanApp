import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils"

// Define the styles for the divider using class-variance-authority (CVA)
const dividerVariants = cva("border-0", {
  variants: {
    variant: {
      solid: "border-t",
      dashed: "border-t border-dashed",
      dotted: "border-t border-dotted",
    },
    thickness: {
      thin: "border-[1px]",
      medium: "border-[2px]",
      thick: "border-[4px]",
    },
    color: {
      gray: "border-gray-400",
      black: "border-black",
      blue: "border-blue-500",
      red: "border-red-500",
      custom: "", // Allows custom inline styles for color
    },
  },
  defaultVariants: {
    variant: "solid",
    thickness: "medium",
    color: "gray",
  },
});

// Define the props for the Divider component
export interface DividerProps
  extends Omit<React.HTMLAttributes<HTMLHRElement>, "color">, // Omit the conflicting 'color' property
    VariantProps<typeof dividerVariants> {
  /** Custom color for the divider, applied when `color` is set to `custom` */
  customColor?: string;
}

// Define the Divider functional component
const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    { className, variant, thickness, color, customColor, style, ...props },
    ref
  ) => {
    // Compute the inline styles for the divider
    const dividerStyle: React.CSSProperties = {
      ...style,
      borderColor: color === "custom" ? customColor : undefined, // Apply custom color only if the color is set to "custom"
    };

    return (
      <hr
        ref={ref}
        className={cn(dividerVariants({ variant, thickness, color }), className)} // Combine CVA classes with any additional classes
        style={dividerStyle} // Inline styles for custom color or additional styling
        {...props} // Pass other props to the HR element
      />
    );
  }
);

// Assign display name for better debugging in React DevTools
Divider.displayName = "Divider";

export { Divider };