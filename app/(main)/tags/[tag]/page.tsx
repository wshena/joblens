import { Metadata } from "next";
import { unslugify } from "@/lib/utils";
import ContentContainer from "@/components/container/ContentContainer";
import { getFilteredJobByTags } from "@/utils/jobs";

type Props = {
  params: { tag: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const formattedTag = unslugify(tag);

  return {
    title: `Lowongan Kerja ${formattedTag} | Joblens`,
    description: `Cari lowongan kerja terbaru bidang ${formattedTag} di Joblens.`,
    keywords: [tag, "lowongan kerja", "job search engine", "Next.js"],
  };
}

const Index = async ({ params }: Props) => {
  const { tag } = await params;

  // const jobListByTags = await getFilteredJobByTags(tag, 1, 10);
  // console.log(jobListByTags);

  return (
    <main className="w-full pt-10 md:pt-20 bg-white text-black">
      <ContentContainer>
        <section className="space-y-5">
          <h1 className="capitalize text-md md:text-lg xl:text-xl">
            pekerjaan dengan tag {tag}
          </h1>
        </section>
      </ContentContainer>
    </main>
  );
};

export default Index;
