"use client"

import { cn } from "@/lib/utils"
import { Chapter } from "@prisma/client"
import { 
    DragDropContext, 
    Droppable, 
    Draggable, 
    DropResult 
} from "@hello-pangea/dnd"
import { useEffect, useState } from "react"
import { Grip, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ChapterListProps {
    items: Chapter[]
    onEdit: (id: string) => void
    onReorder: (updateData:{id: string, position: number}[]) => void
}


const ChapterList = ({ items, onEdit, onReorder }: ChapterListProps) => {
    const [isMounted, setIsMounted] = useState(false)
    const [chapters, setChapters] = useState(items)

    // fix hydration error
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null;
    }


    // useEffect(() => {
    //     setChapters(items)
    // }, [items])

    const handleDragEnd = (result: DropResult) => {
        // if the destination is not defined, do nothing
        if (!result.destination) {
            return
        }
        // check if the item is already in the same position
        if (result.source.index === result.destination.index) {
            return
        }
        // shallow copy of the chapters array
        const items = Array.from(chapters)
        // const items = [...chapters] # does the same thing as Array.from(chapters)

        // get the item to be reordered
        const [reorderedItem] = items.splice(result.source.index,1)
        // insert the item at the new position
        items.splice(result.destination.index, 0, reorderedItem) 

        const [startIndex, endIndex] = [result.source.index, result.destination.index].sort((a,b) => a - b)
        const updatedChapters = items.slice(startIndex, endIndex + 1)

        // update the state
        setChapters(items)
        
        // const bulkUpdateData = updatedChapters.map((chapter) => {
        //     const newPosition = items.findIndex((item) => item.id === chapter.id)
        //     return {
        //         id: chapter.id,
        //         position: newPosition
        //     }
        // })
        const bulkUpdateData = updatedChapters.map((chapter, index) => (
            {
                id: chapter.id, 
                position: index + startIndex
            }
        ))
        onReorder(bulkUpdateData)
    }
    

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapter, index) => (
                            <Draggable 
                            key={chapter.id} 
                            draggableId={chapter.id} 
                            index={index}>
                                {(provided) => (
                                    <div className={cn(
                                        "border border-zinc-200 bg-zinc-200 rounded-md p-3 m-2 gap-x-2 text-sm text-muted-foreground",
                                        chapter.isPublished && "border-sky-200 bg-sky-200 text-sky-700"
                                    )}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    >                                       
                                        <div className={"flex items-center justify-between gap-x-2"} {...provided.dragHandleProps}>
                                            
                                               <Grip className="h-5 w-5 mr-2 flex-shrink-0" />
                                               {chapter.title}
                                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                {chapter.isFree && (
                                                    <Badge className="bg-sky-200 text-sky-700">Free
                                                    </Badge>
                                                )}
                                                <Badge className={cn("bg-zinc-700 text-white px-2 py-1", chapter.isPublished && "bg-sky-200 text-sky-700")}>
                                                    {chapter.isPublished ? "Published" : "Draft"}
                                                </Badge>
                                                <Pencil onClick={() => onEdit(chapter.id)} className="h-4 w-4 text-muted-foreground"/>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </Draggable>
                        ))}
                    </div>
                )}
            </Droppable>

        </DragDropContext>
    )
}

export default ChapterList  

{/* <div className="space-y-2">
                    { initialData.chapters.length && initialData.chapters.map((chapter) => (
                        <div key={chapter.id} className="border bg-zinc-200 rounded-md p-3">
                            {chapter.title}
                        </div>
                    ))}
                </div> */}