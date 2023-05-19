import clsx from "clsx";
import { Album } from "@/app/types";

type Props = {
  albums: Album[];
  className?: string;
};

export function Albums({ albums, className }: Props) {
  return (
    <ul className={clsx("space-y-4", className)}>
      {albums.map((album) => (
        <li key={album.title}>
          <article className="border p-3 rounded-lg">
            <h2 className="font-bold text-xl">{album.title}</h2>
            <p>{album.artist}</p>
            <p className="text-sm text-gray-500 mt-3">{album.description}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
