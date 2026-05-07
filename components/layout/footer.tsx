import Link from "next/link";
import {
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  { title: "Marketplace", href: "#featured-products" },
  { title: "Farmer dashboard", href: "/farmer/dashboard" },
  { title: "Buyer dashboard", href: "/buyer/dashboard" },
  { title: "Admin", href: "/admin/dashboard" },
];

const socialLinks = [
  { label: "Website", icon: Globe, href: "#" },
  { label: "Community", icon: MessageCircle, href: "#" },
  { label: "Share", icon: Share2, href: "#" },
];

export function Footer() {
  return (
    <footer className="border-border/70 bg-card/70 border-t">
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_1fr]">
          <div>
            <Logo />
            <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-6">
              FarmSetu is a hackathon MVP for direct farm-to-consumer commerce,
              built to make fresher food and fairer farmer earnings easier to
              understand.
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-primary flex size-9 items-center justify-center rounded-full border transition-colors"
                  aria-label={item.label}
                >
                  <item.icon className="size-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-normal">
              Quick links
            </h3>
            <div className="mt-4 grid gap-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-normal">
              Stay in the loop
            </h3>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              Get demo updates, farmer stories, and launch notes.
            </p>
            <form className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-background min-h-11 rounded-full"
              />
              <Button type="submit" className="min-h-11 rounded-full px-5">
                Join
              </Button>
            </form>

            <div className="text-muted-foreground mt-6 grid gap-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="text-primary size-4" aria-hidden="true" />
                hello@farmsetu.demo
              </p>
              <p className="flex items-center gap-2">
                <Phone className="text-primary size-4" aria-hidden="true" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="text-primary size-4" aria-hidden="true" />
                Built in India for local food networks
              </p>
            </div>
          </div>
        </div>

        <div className="border-border/70 text-muted-foreground mt-10 flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FarmSetu. Hackathon MVP.</p>
          <p>Fresh produce. Fairer trade. Simple technology.</p>
        </div>
      </div>
    </footer>
  );
}
