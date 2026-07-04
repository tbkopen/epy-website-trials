---
layout: page
title: Courses
permalink: /courses/
description: "Hands-on courses where mathematical rigour meets practical implementation."
wide: true
---

{% assign available = site.courses | where: "status", "available" %}
{% assign coming    = site.courses | where: "status", "coming-soon" %}
{% assign archived  = site.courses | where: "status", "archived" %}

{% if available.size > 0 %}
<section aria-labelledby="available-heading">
  <h2 id="available-heading" style="font-size:var(--type-headline-small); margin-bottom:var(--space-6);">Available Now</h2>
  <div class="course-grid">
    {% for course in available %}
      {% include course-card.html course=course %}
    {% endfor %}
  </div>
</section>
{% endif %}

{% if coming.size > 0 %}
<section style="margin-top:var(--space-12);" aria-labelledby="coming-heading">
  <h2 id="coming-heading" style="font-size:var(--type-headline-small); margin-bottom:var(--space-6);">Coming Soon</h2>
  <div class="course-grid">
    {% for course in coming %}
      {% include course-card.html course=course %}
    {% endfor %}
  </div>
</section>
{% endif %}

{% if archived.size > 0 %}
<section style="margin-top:var(--space-12);" aria-labelledby="archived-heading">
  <h2 id="archived-heading" style="font-size:var(--type-headline-small); margin-bottom:var(--space-6);">Archived</h2>
  <div class="course-grid">
    {% for course in archived %}
      {% include course-card.html course=course %}
    {% endfor %}
  </div>
</section>
{% endif %}

{% if available.size == 0 and coming.size == 0 and archived.size == 0 %}
<p class="empty-state">Courses are in development — <a href="/newsletter/">subscribe</a> to be the first to know.</p>
{% endif %}
