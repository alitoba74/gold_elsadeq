import Link from "next/link";
import { Logo } from "@/components/elsadeq/logo";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="xl" showGlow />
        </div>

        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[180px] font-extrabold text-gold-gradient font-display leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-muted-foreground bg-background px-3 py-1 rounded-full border border-gold/20">
              ELSADEQ
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">
          الصفحة غير موجودة / Page Not Found
        </h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          <br />
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-gradient text-black px-5 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Home className="h-4 w-4" />
            الرئيسية / Home
          </Link>
          <Link
            href="/gold"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold/30 text-gold px-5 py-2.5 text-sm font-medium hover:bg-gold/10 transition-colors"
          >
            <Search className="h-4 w-4" />
            أسعار الذهب / Gold Prices
          </Link>
        </div>
      </div>
    </div>
  );
}
