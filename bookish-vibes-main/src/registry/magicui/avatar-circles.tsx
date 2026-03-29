import { cn } from "@/lib/utils";

interface Avatar {
  imageUrl: string;
  profileUrl?: string;
}

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: Avatar[];
}

export function AvatarCircles({ numPeople, className, avatarUrls }: AvatarCirclesProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {avatarUrls.map((avatar, index) => {
        const content = (
          <img
            src={avatar.imageUrl}
            alt={`Avatar ${index + 1}`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border-2 border-background object-cover brutal-border ring-0 transition-transform hover:scale-110"
          />
        );

        return avatar.profileUrl ? (
          <a
            key={index}
            href={avatar.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="-ml-3 first:ml-0"
            style={{ zIndex: avatarUrls.length - index }}
          >
            {content}
          </a>
        ) : (
          <div
            key={index}
            className="-ml-3 first:ml-0"
            style={{ zIndex: avatarUrls.length - index }}
          >
            {content}
          </div>
        );
      })}
      {numPeople && (
        <div className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary brutal-border text-xs font-bold text-primary-foreground">
          +{numPeople}
        </div>
      )}
    </div>
  );
}
