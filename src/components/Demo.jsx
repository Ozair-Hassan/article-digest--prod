import { useState, useEffect } from 'react'
import { copy, linkIcon, loader, tick, tr } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'
import {
  useGetTranslateMutation,
  useLazyGetLanguagesQuery,
} from '../services/translate'
import { data } from 'autoprefixer'

const Demo = () => {
  const [article, setArticle] = useState({
    url: '',
    summary: '',
    translate: '',
  })
  const [allLanaguages, setAllLanguages] = useState([])
  const [targetLang, setTargetLang] = useState('ur')

  const [allArticles, setAllArticles] = useState([])
  const [copied, setCopied] = useState('')
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()
  const [getTranslate, translateObj] = useGetTranslateMutation()
  const [getLanaguage, obj] = useLazyGetLanguagesQuery()

  const handleLang = async () => {
    const { data } = await getLanaguage()
    setAllLanguages(data.data.languages)
  }
  useEffect(() => {
    handleLang()
  }, [])
  // useEffect(() => {
  //   console.log(allLanaguages)
  // }, [allLanaguages])

  useEffect(() => {
    console.log(translateObj.isLoading)
  }, [translateObj])

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    )
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await getSummary({ articleUrl: article.url })
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary }
      const updatedAllArticles = [newArticle, ...allArticles]
      setArticle(newArticle)
      setAllArticles(updatedAllArticles)
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles))
    }
  }

  const handleSubmitTranslate = async (e) => {
    e.preventDefault()

    const encodedParams = new URLSearchParams()
    encodedParams.set('source_language', 'en')
    encodedParams.set('target_language', targetLang)
    encodedParams.set('text', article.summary)

    const { data } = await getTranslate(encodedParams)

    if (data?.data.translatedText) {
      const newArticle = { ...article, translate: data.data.translatedText }
      // const updatedAllArticles = [newArticle, ...allArticles]

      setArticle(newArticle)
      // setAllArticles(updatedAllArticles)
      // localStorage.setItem('articles', JSON.stringify(updatedAllArticles))
    }
  }

  useEffect(() => {
    // console.log(article)
  }, [article])

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl)
    navigator.clipboard.writeText(copyUrl)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <section className="mt-16 w-full max-w-[100%] ">
      {/* Search */}
      <div className="flex flex-col max-w-[50%] mx-auto w-full gap-2 ">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => {
              setArticle({ ...article, url: e.target.value })
            }}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↵
          </button>
        </form>
        {/* Browse URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div
                className="copy_btn"
                onClick={() => handleCopy(item.url)}
              >
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Display results */}
      <div className="max-w-full flex flex-row justify-center items-center">
        <div className="my-10 max-w-full flex justify-center items-center ">
          {isFetching ? (
            <img
              src={loader}
              alt="Loading..."
              className="w-20 h-20 object-contain"
            />
          ) : error ? (
            <p className="font-inter font-bold text-black text-center">
              Well that wasn't supposed to happen....
              <br />
              <span className="font-satoshi font-normal text-gray-700">
                {error?.data?.error}
              </span>
            </p>
          ) : (
            article.summary && (
              <div className="flex flex-col gap-3">
                <h2 className="font-bold font-satoshi text-gray-300 text-xl">
                  Article <span className="blue_gradient">Summary</span>
                </h2>
                <div className="summary_box ">
                  <p className="font-inter font-medium text-sm text-gray-700">
                    {article.summary}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex flex-row gap-4 max-h-60 mr-5">
          <div className="text-white ml-5 flex flex-col">
            <label htmlFor="language">Choose a language:</label>
            <select
              name="language"
              value={targetLang}
              className="bg-black"
              onChange={(e) => {
                setTargetLang(e.target.value)
              }}
            >
              {allLanaguages.map((item, index) => (
                <option
                  key={index}
                  value={item.code}
                  className="item-center text-center"
                >
                  {item.name}
                </option>
              ))}

              {/* <option value="af">Afrikaans</option>
              <option value="rw">Kinyarwanda</option>
              <option
                value="ur"
                defaultChecked
              >
                Urdu
              </option>
              <option value="en">English</option> */}
            </select>
          </div>

          <div
            className="copy_btn2 ml-5 "
            onClick={handleSubmitTranslate}
          >
            <img
              src={tr}
              alt="copy_icon"
              className="w-[40%] h-[40%] object-contain "
            />
          </div>
          <h2 className="flex-1 font-bold font-satoshi text-gray-300 text-3xl mt-1">
            Translate
          </h2>
        </div>

        <div className="my-10 max-w-full flex justify-center items-center ">
          {translateObj.isLoading ? (
            <img
              src={loader}
              alt="Loading..."
              className="w-20 h-20 object-contain"
            />
          ) : error ? (
            <p className="font-inter font-bold text-black text-center">
              Well that wasn't supposed to happen....
              <br />
              <span className="font-satoshi font-normal text-gray-700">
                {error?.data?.error}
              </span>
            </p>
          ) : (
            article.translate && (
              <div className="flex flex-col gap-3">
                <h2 className="font-bold font-satoshi text-gray-300 text-xl mt-5">
                  Article <span className="blue_gradient">Translation</span>
                </h2>
                <div className="summary_box">
                  <p className="font-inter font-medium text-sm text-gray-700">
                    {article.translate}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}

export default Demo
