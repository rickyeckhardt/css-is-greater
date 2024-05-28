// pages/api/posts/index.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cssToJson } from '@/lib/utils';

const cssFilePath = path.join(process.cwd(), 'styles', 'posts.css');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    fs.readFile(cssFilePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Failed to read CSS file' });
      } else {
        res.status(200).json(cssToJson(data));
      }
    });
  } else if (req.method === 'POST') {
    // Handle POST request: Add a new post to the CSS file
    const { title, author, content } = req.body;

    if (!title || !author || !content) {
      res
        .status(400)
        .json({ error: 'Title, author, and content are required' });
      return;
    }

    const postId = uuidv4();
    const newPost = `
      .post-${postId} {
        --title: "${title.replace(/"/g, '\\"')}";
        --author: "${author.replace(/"/g, '\\"')}";
        --content: "${content.replace(/"/g, '\\"')}";
      }
    `;

    fs.appendFile(cssFilePath, newPost, 'utf8', (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to write to CSS file' });
      } else {
        res
          .status(200)
          .json({ message: 'Post added successfully', id: postId });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
