import styles from '@/pages/index.module.css';
import CurrentWeather from '../components';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-white">
      <CurrentWeather/>
  </main>
  )
}