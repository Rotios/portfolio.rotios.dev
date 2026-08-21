---
title: "From Windsurf to CMUX: Finding My AI Coding Setup"
summary: "How I made the jump from IDEs to terminal multiplexers for running Claude Code agents in parallel."
date: "2026-08-20"
---

## Introduction

When I first began using AI for software development, my favorite tool was Windsurf. As a backend engineer who remained stubbornly stuck to IntelliJ until I started coding more in Typescript, Windsurf felt like the best marriage between AI and IDE. However, as Claude Code's advantages became more and more clear, I decided to switch from using Windsurf back to VS Code.

Little did I know my return to VS Code would be short lived. As the months passed, I found the IDE to be very constricting. Part of the issue was the limitations placed upon us by the workplace - Claude was limited to an extremely closed sandbox on our terminal. But even at home I found I was using the terminal more often than I was using the IDE to edit code. As Claude became more powerful and as I began using worktrees more and more to parallelize multiple tasks, I realized I had to make the switch from an integrated IDE terminal to a standalone one.

Initially I began with the MacOS terminal. But its primitiveness quickly had me searching for more. I switched over to iTerm2, and that hit a spot I was initially missing. With iTerm2 I was able to supervise Claude while it worked to solve multiple issues at once on one page. As a ticket or issue came in, I could open a separate panel, give Claude the issue or spec, and watch as it created a worktree to solve it while others did the same thing. It was multi-tasking at a new level, but even still I knew there was something missing.

As a senior software engineer you don't always work on a single project. Instead you are often working on multiple different projects at once. While iTerm let me work on a single project with multiple worktrees, I found I was still opening multiple windows to keep track of what each agent was working on. Then my coworker introduced me to CMUX, and coding got so much better.

## What is CMUX?

For those unfamiliar, CMUX is an open-source MacOS terminal and browser multiplexer built on Ghostty. Like iTerm, CMUX has multipane functionality. However, it builds on top of this functionality by adding vertical tabs called workspaces that allow you to truly organize your windows more effectively. This meant that while previously I would often have 3 or more iTerm windows open with four or more panes each, I could now keep a single window open and simply switch between workspaces when I wanted to work on another project.

Workspaces gave me the ability to multitask at an unprecedented scale. Within a single workspace, I could have Claude tackle two or three different issues for a single project simultaneously. To ensure these agents had the proper context, I'd spend time defining the necessary specs and drafts with them before letting them work autonomously. I also provided the agents with a skill that would guide them with testing, pushing their changes and drafting PRs in the appropriate formats.

While those agents worked on the simple changes, I tracked down the larger features in separate panes. These features included work that required much more robust planning and testing. For example, if the feature required major refactors or architectural changes, I would spend my time working with Claude on that feature while the rest worked in the background. By assigning each agent its own worktree, they could tackle issues independently with minimal risk of collision.

But even this workflow was only touching the surface of what CMUX could do. As with most regulated spaces, the actual level of functionality you can truly bring out of a piece of software is limited by what your company allows. With regards to CMUX, that meant one of its biggest selling points lay just out of reach while I was in the office. But at home was where I could make CMUX - or, more accurately, Claude - sing.

## Next Time: Getting the Most Out of CMUX with Claude

While workspaces significantly improved my organization and efficiency, there was still one key feature I was itching to explore: fully autonomous agent orchestration via the CMUX CLI.

What's your current terminal setup for managing AI agents? Are you sticking to the IDE, or have you made the leap to a standalone multiplexer?
