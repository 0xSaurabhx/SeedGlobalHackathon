"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useSession, signOut } from "next-auth/react" // Added imports

const sidebarItems = [
  { name: "Dashboard", href: "/" },
  { name: "Health Analyzer", href: "/health-analyzer" },
  { name: "Wear OS Tracker", href: "/wear-os-tracker" },
  { name: "X-Ray Analyzer", href: "/xray-analyzer" }, // Add new page
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession() // Added session

  const SidebarContent = (
    <ScrollArea className="flex-1 px-3">
      <div className="flex flex-col gap-2 pt-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("justify-start", pathname === item.href && "bg-gray-200 dark:bg-gray-700")}
            asChild
            onClick={() => setOpen(false)}
          >
            <Link href={item.href}>{item.name}</Link>
          </Button>
        ))}
        {session ? (
          <Button onClick={() => signOut()}>Sign Out</Button>
        ) : (
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </ScrollArea>
  )

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link className="flex items-center gap-2 font-semibold" href="/" onClick={() => setOpen(false)}>
                <span className="">Medical Dashboard</span>
              </Link>
            </div>
            {SidebarContent}
          </div>
        </SheetContent>
      </Sheet>
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <span className="">Medical Dashboard</span>
            </Link>
          </div>
          {SidebarContent}
        </div>
      </div>
    </>
  )
}

