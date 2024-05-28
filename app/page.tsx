'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/types/Post';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
          cache: 'no-cache',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchPosts();
  }, []);

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
      {error && <p className="text-red-500">{error}</p>}
      <ul className="flex flex-col space-y-6">
        {posts.map((post) => (
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
