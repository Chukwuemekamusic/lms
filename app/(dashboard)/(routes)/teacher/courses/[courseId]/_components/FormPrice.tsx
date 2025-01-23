"use client"
import { useState } from "react"
import { Pencil, X, PoundSterling } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Course } from "@prisma/client"
import { formatPrice } from "@/lib/tools"

type FormPriceProps = {
    initialData: Course
    courseId: string
}


const FormPrice= ({initialData, courseId}: FormPriceProps) => {
    const formSchema = z.object({
        price: z.coerce.number(),
      })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined,
        },
    })
    const {isSubmitting, isValid} = form.formState
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => {
        setIsEditing(prev => !prev)
    }
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course price updated")
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Failed to update course")
        }
    }

    const priceValue = initialData.price ? formatPrice(initialData.price) : "No price"

    return (
        <div className="mt-6 border bg-zinc-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center"><PoundSterling className="h-4 w-4 mr-2 text-customBlue font-bold" />Course price</h2>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
             <p className={cn("text-sm mt-2", !initialData.price && "text-muted-foreground italic")}>
                {priceValue}
            </p>}
            {isEditing && (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="space-y-8 mt-8">
                        <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input
                                disabled={isSubmitting}
                                placeholder="add a price" 
                                {...field} 
                                className="bg-white"
                                type="number"
                                step="0.01"
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            
                                <Button onClick={toggleEdit} type="button" variant="outline">
                                    Cancel
                                </Button>
                           
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>

    )
}

export default FormPrice