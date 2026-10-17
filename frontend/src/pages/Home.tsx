import { useState } from 'react'
import { Link } from 'react-router-dom'
// heroImg from './src/assets/hero.png'
//import reactLogo from './src/assets/react.svg'
//import viteLogo from './src/assets/vite.svg'
//import './App.css'

export function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
       {/*  <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div> */}
        <div>
          <h1>This is a homepage! Test Test!</h1>
          <Link to="/workspace">Go to Workspace</Link>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>
  
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}