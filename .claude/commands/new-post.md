Create a new blog post file.

Steps:
1. Ask the user for: post title, primary category, and whether it contains math (yes/no).
2. Derive a URL slug: lowercase the title, replace spaces with hyphens, strip punctuation and stop words (a, an, the, of, in, to, etc.), max 6–8 words.
3. Get today's date in YYYY-MM-DD format.
4. Create the file at `_posts/YYYY-MM-DD-{slug}.md` using the template at `.claude/templates/post.md`.
5. Fill in the frontmatter with the user-provided values. Set `math: true` only if they said yes.
6. Leave all body sections as the placeholder text from the template.
7. Print the full file path so the user can open it.

Do not create the `_posts/` directory if it doesn't exist — remind the user to run `bundle install` first if the project hasn't been initialized yet.
