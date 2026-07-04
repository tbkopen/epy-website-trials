---
layout: page
title: Contact
permalink: /contact/
description: "Get in touch."
---

Have a question, spotted an error in a post, or just want to say hello? Fill in the form and I'll get back to you.

<form class="contact-form" action="https://formspree.io/f/[FORMSPREE_FORM_ID]" method="POST">
  <div class="contact-form__group">
    <label for="contact-name">Name</label>
    <input type="text" id="contact-name" name="name" required autocomplete="name" placeholder="Your name">
  </div>
  <div class="contact-form__group">
    <label for="contact-email">Email</label>
    <input type="email" id="contact-email" name="email" required autocomplete="email" placeholder="you@example.com">
  </div>
  <div class="contact-form__group">
    <label for="contact-message">Message</label>
    <textarea id="contact-message" name="message" required placeholder="What's on your mind?"></textarea>
  </div>
  <button class="btn btn--filled" type="submit">Send message</button>
</form>

<p style="margin-top:var(--space-6); color:var(--color-on-surface-variant); font-size:var(--type-body-small);">
  Or email directly: <a href="mailto:hello@elastropy.com">hello@elastropy.com</a>
</p>
