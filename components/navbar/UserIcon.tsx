import { LuUser2 } from "react-icons/lu";
import { fetchProfileImage } from "@/utils/actions";
import Image from "next/image";

export default async function UserIcon() {
  const profileImage = await fetchProfileImage();
  
  if (profileImage) {
    return (
      <Image
        src={profileImage}
        className="w-6 h-6 rounded-full object-cover"
        alt="user icon"
        width={24}
        height={24}
      />
    );
  }
  return <LuUser2 className="w-6 h-6 bg-primary rounded-full text-white" style={{width: "24px", height: "24px"}} />;
}
