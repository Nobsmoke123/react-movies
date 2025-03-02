import { useState } from 'react'
import './App.css'

import Search from './components/search.tsx'

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <div className='pattern'>
        <div className="wrapper">
          <header>
              <img src="./hero.png" alt="Hero Banner" />
              <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          </header>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </div>
      </div>
    </main>
  )
}

export default App
