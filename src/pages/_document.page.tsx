import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Script
          src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"
          strategy="afterInteractive"
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
