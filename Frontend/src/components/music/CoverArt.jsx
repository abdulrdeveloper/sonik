import { useState } from "react";
import { Disc3 } from "lucide-react";

export default function CoverArt({
  src,
  alt,
  className = "",
  priority = false,
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-[#d8b09a] ${className}`}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,#d5b198,#6a7e67)] text-3xl text-paper/80">
          <Disc3 aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
