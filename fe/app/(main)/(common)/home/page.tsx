import Footer from '@/components/layout/Footer'
import { HomePage } from './HomePage'

const Home = () => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-grow">
        <HomePage />
      </div>
      <Footer />
    </div>
  )
}

export default Home