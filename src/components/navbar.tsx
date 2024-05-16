import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WebcamIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/toggle";
import { useAuthStore } from "@/lib/stores/user-store";

const Navbar = () => {
  const { signOut, user } = useAuthStore();

  return (
    <div className="flex gap-4 px-4 py-2 justify-between items-center bg-primary-foreground sticky top-0 z-[999]">
      <div className="flex items-center gap-2">
        <WebcamIcon />
        <span className="font-bold hidden sm:block">CAMB.AI x GPEC</span>
      </div>
      <div className="flex items-center gap-4 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar>
                <AvatarImage
                  referrerPolicy="no-referrer"
                  src={user?.avatarUrl as string}
                  alt={user?.name ?? "User"}
                />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-[999]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
