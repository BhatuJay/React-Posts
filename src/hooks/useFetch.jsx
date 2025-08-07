import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [apiPosts, setAPIPosts] = useState(null);
  const [apiDataLoading, setIsAPIDataLoading] = useState(false);

  useEffect(() => {
    setIsAPIDataLoading(true)
    fetch(url)
      .then((res) => res.json())
      .then((data) => {setAPIPosts(data); setIsAPIDataLoading(false)});
  }, [url]);

  return [ apiPosts, apiDataLoading];
};