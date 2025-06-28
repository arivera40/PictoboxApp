import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
          Share your moments with Pictobox
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Connect with friends, share your favorite photos, and discover amazing content from around the world.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/register">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg" className="bg-white">
            Sign In
          </Button>
        </Link>
      </div>
    </section>
  )
}
