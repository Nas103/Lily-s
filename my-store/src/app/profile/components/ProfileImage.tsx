"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getGravatarUrlSync } from "@/lib/gravatar-client";
import { useAuth } from "@/stores/authStore";
import { Edit } from "lucide-react";

interface ProfileImageProps {
  size?: number;
  className?: string;
  showEditButton?: boolean;
}

export function ProfileImage({ size = 96, className = "", showEditButton = false }: ProfileImageProps) {
  const user = useAuth((state) => state.user);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfileImage = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: {
            "x-user-id": user.id,
            "x-user-email": user.email,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfileImageUrl(data.profileImageUrl || null);
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, [user]);

  // Use custom image if available, otherwise fallback to Gravatar
  const imageUrl = profileImageUrl || (user ? getGravatarUrlSync(user.email, size) : "");

  if (loading) {
    return (
      <div 
        className={`rounded-full bg-zinc-100 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className="rounded-full overflow-hidden bg-zinc-100 flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src={imageUrl}
          alt={user?.name || user?.email || "Profile"}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          unoptimized
        />
      </div>
      {showEditButton && (
        <button className="absolute bottom-0 right-0 p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition">
          <Edit size={16} />
        </button>
      )}
    </div>
  );
}

