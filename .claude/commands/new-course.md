Create a new course page file.

Steps:
1. Ask the user for: course title, tagline (one-sentence benefit statement), price (number), currency (default USD), and status (`available` or `coming-soon`).
2. Derive a slug: lowercase title, replace spaces with hyphens, strip punctuation.
3. Create the file at `_courses/{slug}.md` using the template at `.claude/templates/course.md`.
4. Fill in the frontmatter with the user-provided values. Leave `purchase_url:` blank (user fills it in after setting up the payment platform).
5. Leave all body section placeholders intact.
6. Print the full file path.

Also remind the user to:
- Add a thumbnail image at `/assets/images/courses/{slug}.jpg` (1200×630px recommended)
- Fill in `purchase_url:` once the course is set up on the payment platform (Gumroad / LemonSqueezy)
- Set `order:` to control display position on the /courses/ listing page
