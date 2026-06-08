import { useAuthStore } from "@/lib/zustand/authStore";
import { useUtilityStore } from "@/lib/zustand/utilityStore";

const UserProfileButton = () => {
  const user = useAuthStore((state) => state.user);
  const openModal = useUtilityStore((state) => state.openModal);

  const fullName = [
    user?.user_metadata?.first_name,
    user?.user_metadata?.last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const displayName =
    fullName || user?.user_metadata?.username || user?.email || "Akun Saya";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <button
      type="button"
      // onClick={() =>
      //   openModal(<UserAccountModal />, {
      //     contentClassName: "w-full max-w-md",
      //   })
      // }
      className="cursor-pointer hidden items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 transition-colors hover:border-green-200 hover:bg-green-50 lg:flex"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
        {initial}
      </div>
      <div className="text-left">
        <p className="text-xs text-gray-500">Akun</p>
        <p className="max-w-32 truncate text-sm font-semibold text-gray-900">
          {displayName}
        </p>
      </div>
    </button>
  );
};

export default UserProfileButton;
