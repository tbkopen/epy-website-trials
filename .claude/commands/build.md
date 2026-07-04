Run a full production build and report any issues.

Steps:
1. Run `JEKYLL_ENV=production bundle exec jekyll build` and capture output.
2. Report any errors or warnings — if the build fails, show the relevant error lines and suggest a fix.
3. If the build succeeds, report:
   - Number of files generated
   - Any deprecation warnings that should be addressed
   - Remind the user to test locally with `bundle exec jekyll serve` before deploying
4. Do NOT auto-deploy — deployment requires the user's explicit instruction.
