import { Post } from '@/types/Post';

export const cssToJson = (cssString: string): Post[] => {
  const postRegex = /\.post-([a-z0-9-]+) \{([^}]+)\}/g;
  const posts: Post[] = [];
  let match: RegExpExecArray | null;

  while ((match = postRegex.exec(cssString)) !== null) {
    const [, id, properties] = match;
    const props: { [key: string]: string } = {};

    properties
      .trim()
      .split(';')
      .forEach((prop) => {
        const [key, value] = prop.split(':').map((s) => s.trim());
        if (key && value) {
          const cleanedKey = key.replace(/^--/, '');
          // Remove both double and single quotes from the value
          props[cleanedKey] = value.replace(/^["']|["']$/g, '');
        }
      });

    posts.push({ id, ...props } as Post);
  }

  return posts;
};
