---
layout: profiles
permalink: /people/
title: people
description: members of the lab or group
nav: true
nav_order: 7
---

{% if site.data.people.profiles.size > 0 %}
  {% for person in site.data.people.profiles %}
  <div class="profile" style="text-align: {{ person.align }}">
      <img src="{{ person.image }}" {% if person.image_circular %}style="border-radius: 50%;"{% endif %}>
      <div class="profile-content">
          {% include {{ person.content }} %}
          <div class="more-info">
              {{ person.more_info }}
          </div>
      </div>
  </div>
  {% endfor %}
{% else %}
  <p>No profiles available yet.</p>
{% endif %}
