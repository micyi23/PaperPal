import './global.css'
import '../src/index.css'

export const metadata = {
  title: 'PaperPal',
  description: 'PaperPal application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

