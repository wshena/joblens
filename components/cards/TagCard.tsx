import { createSlug } from "@/lib/utils";
import Link from "next/link";

const TagCard = async ({ tag, count }: { tag: string; count: number }) => {
  const slug = createSlug(tag);

  return (
    <Link
      href={`/tags/${slug}`}
      className="group cursor-pointer block w-full max-w-xs"
    >
      <div className="h-full px-3 py-2 rounded-md group-hover:shadow-md border border-gray-200 transition-all duration-150 ease-in-out">
        <div className="flex flex-col gap-1 items-start">
          <span className="font-bold text-md md:text-lg capitalize truncate w-full">
            {tag}
          </span>
          <span className="text-[.7rem] text-gray-500 tracking-widest capitalize">
            {count} jobs
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TagCard;
