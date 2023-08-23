import { logoC } from '../assets'

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <img
          src={logoC}
          alt="sumz_logo"
          className="w-28 object-contain mt-2"
        />
        <button
          type="button"
          onClick={() =>
            window.open('https://github.com/Ozair-Hassan/readwise')
          }
          className="blue_btn"
        >
          {' '}
          GitHub
        </button>
      </nav>

      <h1 className="head_text">
        {' '}
        Enlighten Your Reading with <br className="max-md:hidden" />
        <span className="text_gradient_blue"> OpenAI GPT-4</span>
      </h1>
      <h2 className="desc">
        Boost Your Reading Skills with Readwise AI: Embark on a Journey of
        Knowledge by Effortlessly Summarizing and Translating Articles Using
        OpenAI GPT-4.
      </h2>
    </header>
  )
}

export default Hero
