import { useEffect, useState } from "react";
import { fetchGalleryImages } from "../../services/hotelApi";
import type { GalleryImage } from "../../services/hotelApi";

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchGalleryImages();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <div className="pt-24 pb-16 bg-[var(--color-accent)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Our Spaces</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)]">
            Gallery curated by our team
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse the latest moments and interiors uploaded directly from the hotel admin.
            Each image is optimized for quick previews.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center text-gray-600 border border-[var(--color-border)] rounded-2xl py-12">
            No images added yet. Upload photos from the Django admin to showcase them here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl shadow-md border border-[var(--color-border)] bg-white"
              >
                <div className="h-56 w-full overflow-hidden bg-[var(--color-secondary-light)]">
                  <img
                    src={item.image}
                    alt={item.title || "Hotel gallery"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{item.title || "Untitled"}</p>
                    <p className="text-xs text-white/80">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {item.is_featured && (
                    <span className="px-3 py-1 text-[11px] rounded-full bg-white/90 text-black shadow">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;

