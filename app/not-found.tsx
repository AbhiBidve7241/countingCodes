import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export default function NotFound() {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground font-sans min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center px-5 lg:px-8">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <p className="font-heading text-8xl font-extrabold text-primary opacity-20 select-none">404</p>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="mt-3 max-w-sm text-muted-foreground">
            That page doesn&apos;t exist — it may have moved or the link is broken.
          </p>
          <Link
            href="/"
            className="mt-8 flex w-fit items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
          >
            <Home size={17} />
            Go home <ChevronRight size={17} />
          </Link>
        </main>

        <footer className="border-t border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <Logo size="sm" />
            <span>© 2026 CountingCodes</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
