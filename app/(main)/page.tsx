import ContentContainer from "@/components/container/ContentContainer";
import { getJobs, getJobTags } from "@/utils/jobs";

export default async function Home() {
  const [{ data: jobs }, tags] = await Promise.all([
    getJobs({ page: 1 }),
    getJobTags(),
  ]);

  // console.log("Jobs count:", jobs.length);
  // console.log("Jobs:", jobs.slice(0, 2));
  // console.log("Tags:", tags);

  return (
    <main className="w-full pt-10 md:pt-20 bg-white text-black">
      <ContentContainer>
        <h1>hello world</h1>
      </ContentContainer>
    </main>
  );
}
