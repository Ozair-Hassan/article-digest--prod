import { useState, useEffect } from 'react'
import { copy, linkIcon, loader, tick, tr } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'
import {
  useGetTranslateMutation,
  useLazyGetLanguagesQuery,
} from '../services/translate'

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
      console.log(updatedAllArticles)
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
      const updatedAllArticles = [newArticle, ...allArticles]
      setArticle(newArticle)
      // const allLocalStorageArticles = JSON.parse(
      //   localStorage.getItem('articles')
      // )
      // const presentTranslation = allLocalStorageArticles.map((item, index) => {
      //   if (item.url === newArticle.url) return index
      // })
      // // console.log(allLocalStorageArticles[presentTranslation])
      // // console.log(allLocalStorageArticles)
      // allLocalStorageArticles[presentTranslation].translate =
      //   newArticle.translate
      // setAllArticles(allLocalStorageArticles)
      // localStorage.setItem('articles', JSON.stringify(allLocalStorageArticles))
    }
  }

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
      <div className="grid grid-cols-1 l:grid-cols-3 md:grid-cols-3 gap-2 mt-10">
        <div className=" p-4 ">
          {' '}
          <div className="my-10 max-w-full flex justify-center items-center ">
            <div className="flex flex-col gap-3">
              <h2 className="font-bold font-satoshi text-gray-300 text-xl mx-auto">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box w-[100%] ">
                {isFetching ? (
                  <div className="w-20 h-20 flex justify-center items-center">
                    <img
                      src={loader}
                      alt="Loading..."
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                ) : error ? (
                  <p className="font-inter font-bold text-black text-center">
                    Well, that wasn't supposed to happen....
                    <br />
                    <span className="font-satoshi font-normal text-gray-700">
                      {error?.data?.error}
                    </span>
                  </p>
                ) : (
                  <p className="font-inter font-medium text-sm text-gray-700">
                    {article.summary || 'No summary available.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className=" p-4 my-auto ">
          {' '}
          <div className="flex flex-col gap-4 max-h-60 mx-6 ">
            <h2 className="flex-1 font-bold font-satoshi text-gray-300 text-3xl mt-10 mx-auto">
              Translate
            </h2>
            <div
              className="copy_btn2 mx-auto "
              onClick={handleSubmitTranslate}
            >
              <img
                src={tr}
                alt="copy_icon"
                className="w-[60%] h-[60%] object-contain "
              />
            </div>
            <div className="flex items-center py-0.5 border-transparent bg-slate-600/50 transition-all duration-200 overflow-hidden px-1.5 border-[2px] rounded-md mx-auto">
              <div className="py-1 text-lg duration-200 md:text-xl text-slate-400 hover:text-slate-200 ">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 20 20"
                  className="hover:cursor-pointer"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>

              <select
                name="language"
                value={targetLang}
                className="text-base text-slate-300 focus:outline-none bg-transparent  w-52 pl-1.5 ml-1 opacity-100 border-l-2 border-slate-600 transition-opacity duration-500"
                onChange={(e) => {
                  setTargetLang(e.target.value)
                }}
              >
                {allLanaguages.map((item, index) => (
                  <option
                    key={index}
                    value={item.code}
                    className="text-base bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 text-slate-100 focus:text-slate-200 focus:outline-none pl-1.5 ml-1 opacity-100 border-l-2 border-slate-600 transition-opacity duration-500 backdrop"
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className=" p-4 ">
          {' '}
          <div className="my-10 max-w-full flex justify-center items-center ">
            <div className="flex flex-col gap-3">
              <h2 className="font-bold font-satoshi text-gray-300 text-xl mx-auto">
                Article <span className="blue_gradient">Translation</span>
              </h2>
              <div className="summary_box w-[100%] ">
                {translateObj.isLoading ? (
                  <div className="w-20 h-20 flex justify-center items-center">
                    <img
                      src={loader}
                      alt="Loading..."
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                ) : error ? (
                  <p className="font-inter font-bold text-black text-center">
                    Well, that wasn't supposed to happen....
                    <br />
                    <span className="font-satoshi font-normal text-gray-700">
                      {error?.data?.error}
                    </span>
                  </p>
                ) : (
                  <p className="font-inter font-medium text-sm text-gray-700">
                    {article.summary || 'No translation available.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-full flex flex-row justify-center items-center">
        {/* Display results Summary */}

        {/* Translate options */}

        {/* Display results Translation */}
      </div>
    </section>
  )
}

export default Demo

{
  /* {isFetching ? (
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
          )} */
}

{
  /* <div className="my-10 max-w-full flex justify-center items-center ">
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
        </div> */
}
