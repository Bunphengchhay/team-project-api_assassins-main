import { useState } from "react";
function PlayVideo({url}) {
    // const [flip, setFlip] = useState(false);
    const embedURL = convertToEmbedURL(url)
    return ( 
        <iframe
        width="560"
        height="315"
        src= {embedURL}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen>
      </iframe>
      
     );
}

function convertToEmbedURL(youtubeUrl) {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = youtubeUrl.match(regExp);
  
    if (match && match[2].length === 11) {
      const videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    } else {
      return null; // Return null or an appropriate error message if the URL is not valid
    }
  }
export default PlayVideo;