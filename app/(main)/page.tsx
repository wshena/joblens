import TagCard from "@/components/cards/TagCard";
import ContentContainer from "@/components/container/ContentContainer";
import { getRandomTagsWithCount } from "@/utils/jobs";

export default async function Home() {
  const randomJobTags = await getRandomTagsWithCount(8);

  return (
    <main className="w-full pt-10 md:pt-20 bg-white text-black">
      <ContentContainer>
        <section className="space-y-5">
          <h1 className="capitalize text-md md:text-lg xl:text-xl">
            Cari perkerjaan berdasarkan tag populer
          </h1>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {randomJobTags.map((tagObj) => (
              <li className="" key={tagObj.name}>
                <TagCard tag={tagObj.name} count={tagObj.count} />
              </li>
            ))}
          </ul>
        </section>
      </ContentContainer>
    </main>
  );
}
