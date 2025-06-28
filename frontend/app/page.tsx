import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/home/hero-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  )
}
