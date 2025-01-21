import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const backgroundVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-100",
                success: "bg-emerald-100",
                warning: "bg-yellow-100",
                danger: "bg-red-100",
            }, 
            
            size: {
                default: "p-2",
                sm: "p-1"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

const iconVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "text-sky-700",
                success: "text-emerald-700",
                warning: "text-yellow-700",
                danger: "text-red-700",
            },
            size: {
                default: "h-8 w-8",
                sm: "h-4 w-4"
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>
type IconVariantsProps = VariantProps<typeof iconVariants>

type IconBadgeProps = {
    icon: LucideIcon
} & BackgroundVariantsProps & IconVariantsProps 

// interface IconBadgeProps2 extends BackgroundVariantsProps, IconVariantsProps {
//     icon: LucideIcon
// }

export const IconBadge = ({icon: Icon, variant, size, ...props}: IconBadgeProps) => {
    return <div className={cn(backgroundVariants({variant, size}), "flex items-center justify-center")} {...props}>
        <Icon className={cn(iconVariants({variant, size}))} />
    </div>
}
