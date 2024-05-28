import { Post } from '@/types/Post';
import Link from 'next/link';

async function fetchPosts() {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function BlogPage() {
  const posts = await fetchPosts();

  return (
    <main className="max-w-md mx-auto flex flex-col space-y-6 mt-8">
      <div className="flex justify-between">
        <h1 className="text-2xl ">CSS &gt; Postgres</h1>
        <Link
          href="/posts/create"
          className="border rounded-md px-4 py-1 bg-black text-white"
        >
          Create Post
        </Link>
      </div>
      <ul className="flex flex-col space-y-6">
        {posts.map((post: Post) => (
          <li key={post.id} className="border p-4 rounded-lg">
            <Link href={`/posts/${post.id}`} className="font-semibold text-xl">
              {post.title}
            </Link>
            <p>by {post.author}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
