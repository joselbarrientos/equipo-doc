import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Pricing } from '@/components/landing/pricing'
import { CTA } from '@/components/landing/cta'
import { AnimatedBackground } from '@/components/layout/animated-background'

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen relative">
            <AnimatedBackground />
            <Header />
            <main className="flex-grow">
                <Hero />
                <Features />
                <Pricing />
                <CTA />
            </main>
            <Footer />
        </div>
    )
}