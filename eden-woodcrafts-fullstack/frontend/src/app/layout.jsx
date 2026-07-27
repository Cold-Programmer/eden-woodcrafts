import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider, themeInitScript } from "@/components/ui/ThemeProvider";
import { QuickActionPanel } from "@/components/layout/QuickActionPanel";
import { getCurrentUser } from "@/lib/auth";
export const metadata = {
    title: {
        default: "Eden Woodcrafts | Handcrafted Furniture, Nairobi",
        template: "%s | Eden Woodcrafts"
    },
    description: "Eden Woodcrafts is a Nairobi-based carpentry workshop crafting bespoke and ready-made furniture — beds, sofas, dining sets, cabinets and custom pieces built to order.",
    openGraph: {
        title: "Eden Woodcrafts",
        description: "Handcrafted furniture from a Nairobi workshop, made to order.",
        type: "website"
    }
};
export default async function RootLayout({ children }) {
    const user = await getCurrentUser();
    return (<html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }}/>
      </head>
      <body className="flex min-h-screen flex-col bg-page-bg font-sans text-page-ink">
        <ThemeProvider>
          <ToastProvider>
            <Navbar user={user}/>
            <main className="flex-1">{children}</main>
            <Footer />
            <QuickActionPanel />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>);
}
