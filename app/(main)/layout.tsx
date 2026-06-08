import AuthSessionSync from "@/components/auth/AuthSessionSync";
import MainContainer from "@/components/container/MainContainer";
import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainContainer>
      <AuthSessionSync />
      <Navbar />
      {children}
      {/* <Footer /> */}
    </MainContainer>
  );
}
