import { Video, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Video className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-sf-pro font-bold">AI Video Studio</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-primary font-medium">Projects</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Templates</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Avatars</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Voices</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-r from-secondary to-accent text-secondary-foreground">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
