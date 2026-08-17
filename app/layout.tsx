import './globals.css';
import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// Inter Tight — closer to Mistral's tight grotesque display font (ALTMistral)
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Wahyu Sahri Rhamadhan | Fullstack Developer & DevOps Engineer',
    template: '%s | Wahyu Sahri Rhamadhan',
  },
  description:
    'Portfolio of Wahyu Sahri Rhamadhan - Fullstack Developer & DevOps Engineer specializing in scalable web applications, cloud infrastructure, and CI/CD pipelines.',
  keywords: [
    'Wahyu Sahri Rhamadhan',
    'fullstack developer',
    'devops engineer',
    'cloud infrastructure',
    'Kubernetes',
    'AWS',
    'CI/CD pipelines',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'Docker',
    'Terraform',
    'software engineer',
    'web developer Indonesia',
    'portfolio',
  ],
  authors: [{ name: 'Wahyu Sahri Rhamadhan' }],
  creator: 'Wahyu Sahri Rhamadhan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Wahyu Sahri Rhamadhan | Fullstack Developer & DevOps Engineer',
    description:
      'Fullstack Developer & DevOps Engineer specializing in scalable web applications, cloud infrastructure, and CI/CD pipelines.',
    siteName: 'Wahyu Sahri Rhamadhan Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wahyu Sahri Rhamadhan | Fullstack Developer & DevOps Engineer',
    description:
      'Fullstack Developer & DevOps Engineer specializing in scalable web applications, cloud infrastructure, and CI/CD pipelines.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${interTight.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
