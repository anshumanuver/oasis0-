
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';

export default function AppNavigationMenu() {
  const { user, profile } = useAuth();
  
  const isClient = profile?.role === 'client';
  const isNeutral = profile?.role === 'neutral';
  const isAdmin = profile?.role === 'admin';
  
  if (!user) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-orrr-blue-500 to-orrr-blue-700 p-6 no-underline outline-none focus:shadow-md"
                    to="/dashboard-redirect"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium text-white">
                      Dashboard
                    </div>
                    <p className="text-sm leading-tight text-white/90">
                      Access your personalized dashboard to manage all your dispute resolution activities.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {isClient && (
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/party-dashboard"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Client Dashboard</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Manage your dispute cases and communication
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              )}
              {isNeutral && (
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/mediator-dashboard"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Mediator Dashboard</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Manage your mediation cases and hearings
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              )}
              {isAdmin && (
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Administration</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Platform management and oversight
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    to="/services/mediation"
                  >
                    <div className="text-sm font-medium leading-none">Mediation</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Work with a neutral third party to reach a mutually agreeable resolution.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    to="/services/arbitration"
                  >
                    <div className="text-sm font-medium leading-none">Arbitration</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Present your case to an impartial arbitrator for a binding decision.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    to="/services/negotiation"
                  >
                    <div className="text-sm font-medium leading-none">Negotiation</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Engage in structured negotiations with optional neutral guidance.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    to="/cases/new"
                  >
                    <div className="text-sm font-medium leading-none">File New Case</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Start a new dispute resolution process.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/about" className="text-sm font-medium leading-none group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
            About
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
