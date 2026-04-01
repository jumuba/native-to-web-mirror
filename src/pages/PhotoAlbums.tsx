import React, { useState } from "react";
import PhoneLayout from "@/components/PhoneLayout";
import AlbumDetail from "@/components/screens/AlbumDetail";
import { mockAlbums, type Album } from "@/lib/mockData";

function Card({ image, title, onClick }: { image: string; title: string; onClick?: () => void }) {
  return (
    <div
      className="transition-all duration-200 ease-out hover:scale-[1.03]"
      onClick={onClick}
      style={{ width: 110, marginBottom: 14, cursor: "pointer" }}
    >
      <div style={{ width: 110, height: 95, borderRadius: "8px 8px 0 0", overflow: "hidden" }}>
        <img src={image} alt={title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ width: 110, backgroundColor: "#ffffff", borderRadius: "0 0 8px 8px", padding: "4px 6px", minHeight: 28 }}>
        <span style={{ fontSize: 10, color: "#4a5568", fontWeight: 500 }}>{title}</span>
      </div>
    </div>
  );
}

export default function PhotoAlbums() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  if (selectedAlbum) {
    return (
      <PhoneLayout
        cards={[]}
        customContent={
          <AlbumDetail album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />
        }
      />
    );
  }

  return (
    <PhoneLayout
      cards={[]}
      customContent={
        <div className="flex flex-wrap justify-between" style={{ paddingBottom: 12 }}>
          {mockAlbums.map((album) => (
            <Card
              key={album.id}
              image={album.image}
              title={album.title}
              onClick={() => setSelectedAlbum(album)}
            />
          ))}
        </div>
      }
    />
  );
}
