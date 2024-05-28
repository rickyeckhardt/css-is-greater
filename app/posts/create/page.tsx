'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FormValues = {
  title: string;
  author?: string;
  content: string;
};
export default function CreatePost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('Failed to create post');
    }
  };

  return (
    <main className="max-w-md mx-auto flex flex-col space-y-6 mt-8">
      <h1 className="text-2xl">Create Post</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            className="border rounded p-2 w-full"
            {...register('title', { required: true })}
          />
          {errors.title && (
            <span className="text-red-500">Title is required</span>
          )}
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium">
            Author (optional)
          </label>
          <input
            id="author"
            className="border rounded p-2 w-full"
            {...register('author')}
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Post
          </label>
          <textarea
            id="content"
            className="border rounded p-2 w-full"
            {...register('content', { required: true })}
          />
          {errors.content && (
            <span className="text-red-500">Content is required</span>
          )}
        </div>
        <button
          type="submit"
          className="border rounded-md px-4 py-2 bg-black text-white"
        >
          Create Post
        </button>
      </form>
      <Link href="/" className="border rounded-md px-4 py-2 text-center">
        Cancel
      </Link>
    </main>
  );
}
