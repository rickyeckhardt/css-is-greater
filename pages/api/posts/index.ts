import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cssToJson } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

const cssFilePath = path.join(process.cwd(), 'public', 'styles', 'posts.css');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(cssFilePath, 'utf8');
      const postsJson = cssToJson(data);
      return res.status(200).json(postsJson);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read CSS file' });
    }
  }

  if (req.method === 'POST') {
    const { title, author, content } = req.body;
    if (!title || !author || !content) {
      return res.status(400).json({ error: 'Title, author, and content are required' });
    }

    const postId = uuidv4();
    const newPost = `
      .post-${postId} {
        --title: "${title.replace(/"/g, '\\"')}";
        --author: "${author.replace(/"/g, '\\"')}";
        --content: "${content.replace(/"/g, '\\"')}";
      }
    `;

    try {
      fs.appendFileSync(cssFilePath, newPost, 'utf8');
      return res.status(200).json({ message: 'Post added successfully', id: postId });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to write to CSS file' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
