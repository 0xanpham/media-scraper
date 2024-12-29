import { useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoint } from "./config/config";

function App() {
  const limit = 12;
  const [maxPage, setMaxPage] = useState(1);
  const [type, setType] = useState(null);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    let url = `${apiEndpoint}/media?page=${page}&limit=${limit}&`;
    type && (url += `type=${type}&`);
    debouncedValue && (url += `search=${debouncedValue}&`);
    async function getMedias() {
      const resp = await axios.get(url);
      setMedias(resp.data.medias);
      setMaxPage(Math.max(Math.ceil(resp.data.count / limit), 1));
    }
    getMedias();
  }, [page, debouncedValue, type]);

  useEffect(() => {
    setPage(1);
  }, [type, debouncedValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  function handleChangeSearchText(e) {
    e.preventDefault();
    setSearchText(e.target.value);
  }

  const handleChangePage = (event) => {
    setPage(event.target.value);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-screen h-20 border-b-[1px] border-black bg-white z-50 flex flex-row items-center px-20">
        <h1 className="text-4xl font-bold w-1/3">Web Scraper</h1>
        <input
          className="py-2 px-4 w-1/3 border-[1px] bg-white border-black"
          placeholder="Search"
          value={searchText}
          onChange={handleChangeSearchText}
        />
      </nav>
      <div className="h-auto min-h-screen px-20 py-24 w-screen">
        <div className="flex flex-row gap-2 mb-10 items-center">
          <button
            className={`w-32 py-2 border-black border-[1px] ${
              type == null && "bg-black text-white"
            }`}
            onClick={() => setType(null)}
          >
            All
          </button>
          <button
            className={`w-32 py-2 border-black border-[1px] ${
              type == "image" && "bg-black text-white"
            }`}
            onClick={() => setType("image")}
          >
            Image
          </button>
          <button
            className={`w-32 py-2 border-black border-[1px] ${
              type == "video" && "bg-black text-white"
            }`}
            onClick={() => setType("video")}
          >
            Video
          </button>
        </div>
        <section className="grid grid-cols-3 gap-6">
          {medias.map((media) => (
            <div
              className="w-full h-96 bg-gray-500 border-[1px] border-black"
              key={media.id}
            >
              {media.type === "image" ? (
                <img className="w-full h-full object-contain" src={media.url} />
              ) : (
                <video
                  className="w-full h-full"
                  controls={true}
                  src={media.url}
                />
              )}
            </div>
          ))}
        </section>
        <div className="flex flex-row items-center justify-center mt-10">
          <select
            className="py-2 w-32 border-[1px] bg-white border-black text-center"
            id="select-dropdown"
            value={page}
            onChange={handleChangePage}
          >
            <option value="" disabled>
              Choose Page
            </option>
            {Array.from({ length: maxPage }, (_, i) => i + 1).map(
              (option, index) => (
                <option key={index} value={option}>
                  Page {option}
                </option>
              )
            )}
          </select>
        </div>
      </div>
    </>
  );
}

export default App;
