import Link from "next/link";

export default function Header() {
  return (
    <header className="py-4 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 transform rotate-45"></div>
              <div className="w-8 h-8 bg-green-500 rounded-full -ml-2"></div>
            </div>
            <span className="text-xl font-bold ml-2">소리의 일기</span>
          </Link>
          <div className="flex items-center">
            <Link
              href="/write"
              className="bg-black text-white px-4 py-2 rounded-md text-sm"
            >
              글 쓰기
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
