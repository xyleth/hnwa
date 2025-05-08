---
title: How to publish Obsidian notes with Quartz on GitHub Pages
draft: true
tags:
---
 
To hide a section of text wrap it in the following HTML comments:

<!-- publish: exclude -->

<!-- publish: end -->

The Text Transformer plugin is configured to auto add these if you type hidden x without the space as a single word.  This note is also excluded from publishing as a draft.

By default everything is published unless marked as Draft or with these comments.

To get them in call outs put a callout notifier after the first comment, like so:

[! warning] Title of your callout

Then type all your text.  When you are done you select all the text to be included in the callout and bring up the command panel (CMD-P) and select 'toggle blockquote' and obsidian takes care of the rest.  Remember not to include the closing comment.