Create a new static page file.

Steps:
1. Ask the user for: page title, desired URL path (e.g., `/about/`, `/resources/`), and a one-sentence SEO description.
2. Create the file at `_pages/{slug}.md` using the template at `.claude/templates/page.md`.
3. Set `permalink:` to the user-provided path.
4. Fill in the frontmatter. Leave body as placeholder.
5. Print the full file path.

Note: Do not use this command for blog posts (use /new-post) or course pages (use /new-course). This is for standalone pages like About, Contact, Resources, Newsletter, etc.
