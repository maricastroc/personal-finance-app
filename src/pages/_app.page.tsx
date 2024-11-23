import { Public_Sans } from 'next/font/google'
import '@/styles/globals.css'
import { AppProps } from 'next/app'

const font = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${font.className} bg-beige-100`}>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
