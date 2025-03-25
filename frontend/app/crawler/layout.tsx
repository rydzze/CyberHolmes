export const metadata = {
  title: 'CyberHolmes',
  description: 'Cyber Threat Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
