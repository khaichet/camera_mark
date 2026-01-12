import { Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/camera">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Camera size={20} />
          Camera
        </button>
      </Link>
    </div>
  );
}
