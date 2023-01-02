import { useState, useEffect } from "react"

const useFetch =(url) =>{
    const [data , setData] = useState([]);
    const [isloading , setload] = useState(true)
    const [error , setError] = useState(null)
    useEffect(()=>{
        fetch(url).then(res =>{
            if (!res.ok){
                throw Error("could not fetch the data for that resource")
            }
            return res.json();
        }).then(data =>{
            setData(data) ;
            setload(false);
            setError(null);
        })
        .catch(err =>{
            setError(err.message)
            setload(false)
        })
      },[url])
      return {data , isloading , error}
}
export default  useFetch ;