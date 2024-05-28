# CSS is Greater Than Postgres

Welcome to the "CSS is Greater Than Postgres" project! This project humorously uses CSS files as a database to store and manage blog posts. It's built with Next.js and demonstrates creative and unconventional ways to handle data storage and manipulation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Pages](#pages)
- [API Endpoints](#api-endpoints)
- [Data Structure](#data-structure)
- [Components](#components)
- [Prettier](#prettier)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/css-greater-than-postgres.git
   cd css-greater-than-postgres
   ```

2. Install dependencies:

   ```sh
   yarn install
   ```

3. Start the development server:

   ```sh
   yarn dev
   ```

   The application will be available at `http://localhost:3000`.

## Usage

### Creating a Post

1. Navigate to `http://localhost:3000/posts/create` to create a new post.
2. Fill in the Title, Author (optional), and Content fields.
3. Click "Create Post" to save the post. You will be redirected back to the homepage.

### Viewing a Post

1. Navigate to a specific post by clicking on the post title from the homepage or directly visiting `http://localhost:3000/posts/:id`.

### Editing or Deleting a Post

1. Navigate to the post you want to edit or delete by clicking on the post title from the homepage.
2. Click "Edit" to go to the edit page.
3. Update the Title, Author, or Content fields.
4. Click "Update Post" to save the changes, or "Delete Post" to remove the post. You will be redirected back to the homepage.

## Pages

- `/`: Blog page displaying all posts.
- `/posts/create`: Page to create a new post.
- `/posts/:id`: Page to view a specific post.
- `/posts/:id/edit`: Page to edit or delete a specific post.

## API Endpoints

- **GET /api/posts**: Fetch all posts.
- **POST /api/posts**: Create a new post.
- **GET /api/posts/:id**: Fetch a single post by ID.
- **PUT /api/posts/:id**: Update a post by ID.
- **DELETE /api/posts/:id**: Delete a post by ID.

## Data Structure

Posts are written to the CSS file in the following format:

```css
.post-<id > {
  --title: '<title>';
  --author: '<author>';
  --content: '<content>';
}
```

The corresponding TypeScript type for a post is:

```typescript
export type Post = {
  id: string;
  title: string;
  author: string;
  content: string;
  [key: string]: string;
};
```

## Components

### BlogPage

The main page displaying a list of all blog posts. Each post title is a clickable link to the individual post page.

### CreatePost

A page for creating new blog posts. It includes a form with fields for the title, author, and content.

### EditPost

A page for editing and deleting existing blog posts. It pre-fills the form fields with the current post data and includes options to update or delete the post.

## Prettier

This project uses Prettier for code formatting. To format your code, run:

```sh
yarn prettier
```

### Prettier Configuration

The Prettier configuration is defined in the `.prettierrc` file:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80,
  "endOfLine": "auto"
}
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Submit a pull request with a description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
