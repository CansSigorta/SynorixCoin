import Image from "next/image";
import { SITE } from "@/lib/site";

type SynorixLogoProps = {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
};

export function SynorixLogo({
  className = "",
  decorative = true,
  priority = false,
}: SynorixLogoProps) {
  const src = `${SITE.logoPath}?v=${SITE.logoVersion}`;

  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt={decorative ? "" : SITE.logoAlt}
        width={800}
        height={1000}
        sizes="(max-width: 768px) 70vw, 320px"
        className="h-full w-auto max-w-full object-contain object-center"
        draggable={false}
        priority={priority}
        unoptimized
      />
    </span>
  );
}
