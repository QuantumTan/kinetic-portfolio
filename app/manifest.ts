import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jonathan Peguit Jr. | Full-Stack & Systems Developer Portfolio",
    short_name: "Jonathan Peguit",
    description:
      "Official portfolio of Jonathan Peguit Jr. (.NET Clean Architecture, Laravel 12, Next.js, Java) from the University of Mindanao.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/assets/logo-portfolio.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/logo-portfolio.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
