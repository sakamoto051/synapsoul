import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import { BookOpen, Users, Search } from "lucide-react";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">
          Welcome back, {session.user.displayName}!
        </h1>
        <Link href="/books/mybooks">
          <Button className="mt-4">Go to My Books</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 sm:py-6 md:py-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-8 md:px-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
          Welcome to <span className="text-blue-500">SynapsoulBooks</span>
        </h1>
        <p className="mt-2 sm:mt-3 text-xl sm:text-2xl text-gray-300">
          Your personal library manager and reading companion
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mt-6 sm:w-full">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 mb-4 text-blue-500" />}
            title="Manage Your Books"
            description="Keep track of your reading list, current reads, and finished books."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 mb-4 text-green-500" />}
            title="Join Discussions"
            description="Participate in book discussions and share your thoughts with others."
          />
          <FeatureCard
            icon={<Search className="w-8 h-8 mb-4 text-purple-500" />}
            title="Discover New Books"
            description="Find your next great read with our powerful search and recommendation engine."
          />
        </div>

        <Link href="/api/auth/signin">
          <Button className="mt-6 sm:mt-8 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </Link>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 sm:p-6 text-left border border-gray-700 rounded-xl hover:border-blue-500 transition-colors duration-300">
      {icon}
      <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
      <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-400">
        {description}
      </p>
    </div>
  );
}
