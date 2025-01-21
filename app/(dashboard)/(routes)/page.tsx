import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
    return (
        <div>
            <UserButton 
            afterSignOutUrl="/"
            />
        </div>
    )
}