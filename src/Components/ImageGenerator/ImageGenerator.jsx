import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../Assests/default_image.svg";

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState("/");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const imageGenerator = async () => {
    const prompt = inputRef.current.value.trim();
    if (!prompt) {
      alert("Please provide a valid prompt");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://api.together.xyz/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_TOGETHER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "black-forest-labs/FLUX.1-schnell-Free",
            prompt,
            width: 512,
            height: 512,
            num_images: 1,
            response_format: "b64_json",
          }),
        }
      );

      const data = await response.json();

      if (data?.data?.[0]?.b64_json) {
        const base64 = data.data[0].b64_json;
        const imageUrl = `data:image/png;base64,${base64}`;
        setImage_url(imageUrl);
      } else {
        throw new Error("Image generation failed");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI image <span>generator</span>
      </div>

      <div className="img-loading">
        <div className="image">
          <img
            src={image_url === "/" ? default_image : image_url}
            alt="AI generated"
          />
        </div>

        <div className="loading">
          <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
          <div className={loading ? "loading-text" : "display-none"}>
            Loading...
          </div>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to see"
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
