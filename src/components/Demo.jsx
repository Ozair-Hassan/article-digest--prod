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
          className="relative flex justify-center items-center "
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
            className="url_input peer  "
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-black peer-focus:text-black"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-2 gap-2 mt-10 ">
        <div className=" p-4  col-span-5 ">
          {' '}
          <div className="my-10 max-w-full flex justify-center items-center ">
            <div className="flex flex-col gap-3">
              <h2 className="font-bold font-satoshi text-gray-300 text-3xl mx-auto">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box w-[100%] ">
                {isFetching ? (
                  <div className="w-20 h-20 flex justify-center items-center mx-auto">
                    <img
                      src={loader}
                      alt="Loading..."
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                ) : error ? (
                  <p className="font-inter font-bold text-black text-center ">
                    Well, that wasn't supposed to happen....
                    <br />
                    <span className="font-satoshi font-normal text-black">
                      {error?.data?.error}
                    </span>
                  </p>
                ) : (
                  <p className="font-inter font-medium text-sm text-black">
                    {article.summary || 'No summary available.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className=" p-4 my-auto mx-auto col-span-2 ">
          {' '}
          <div className="flex flex-col gap-4 max-h-60 mx-auto my-auto ">
            <div className="  ">
              <select
                placeholder="Select Language"
                name="language"
                value={targetLang}
                className="bg-slate-300/90 rounded-sm text-black"
                onChange={(e) => {
                  setTargetLang(e.target.value)
                }}
              >
                {allLanaguages.map((item, index) => (
                  <option
                    key={index}
                    value={item.code}
                    className="bg-slate-300/75 rounded-sm text-black"
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
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
          </div>
        </div>
        <div className=" p-4  col-span-5">
          {' '}
          <div className="my-10 max-w-full flex justify-center items-center ">
            <div className="flex flex-col gap-3">
              <h2 className="font-bold font-satoshi text-gray-300 text-3xl mx-auto">
                Article <span className="blue_gradient">Translation</span>
              </h2>
              <div className="summary_box w-[100%] ">
                {translateObj.isLoading ? (
                  <div className="w-20 h-20 flex justify-center items-center mx-auto">
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
                    <span className="font-satoshi font-normal text-black">
                      {error?.data?.error}
                    </span>
                  </p>
                ) : (
                  <p className="font-inter font-medium text-sm text-black">
                    {article.translate || 'No translation available.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Demo
