"use client";
import { useAuthStore } from "@/lib/zustand/authStore";
import ContentContainer from "./container/ContentContainer";
import Logo from "./Logo";
import { NavLinks } from "@/const";
import Link from "next/link";
import UserProfileButton from "./buttons/UserProfileButton";
import Button from "./buttons/Button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="fixed top-0 left-0 w-full bg-white text-black font-md">
      <ContentContainer>
        <nav className="flex items-center justify-between">
          {/* logo */}
          <Logo />

          {/* nav links */}
          <ul className="hidden lg:flex items-center gap-4">
            {NavLinks.map((link) => (
              <li key={link.id}>
                <Link
                  aria-label={link.label}
                  href={link.link}
                  className="font-bold text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* search, notification, login/register, profile button */}
          <div className="flex items-center gap-4">
            {/* profile button or login/register buttons */}
            {user?.id ? (
              <UserProfileButton />
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  onClick={() => router.push("/auth/login")}
                  size="sm"
                  label="Masuk"
                  variant="outline"
                  className="border-blue-600 text-blue-600"
                />
                <Button
                  onClick={() => router.push("/auth/register")}
                  size="sm"
                  label="Daftar"
                  variant="primary"
                  className="bg-blue-600 text-white hover:bg-blue-600"
                />
              </div>
            )}
          </div>
        </nav>
      </ContentContainer>
    </header>
  );
};

export default Navbar;
