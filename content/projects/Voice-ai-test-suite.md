---
title: Voice-ai-test-suite
date: 2026-04-05
description: A voice ai testing framework with genesys integration to test Voice Ai for intent detection and evaulation
tags:
  - Test suite
  - Python
  - genesys
  - Sip server
  - LLM evaulation
stack:
  - Custom Python UDP server
  - Raw UDP sockets(G.711 ulaw)
  - Groq Whisper API
  - Piper TTS + espeack fallback
  - Groq(Llama 3.3 70B)
  - Flask
  - Docker
repoUrl: https://github.com/nishanthr878/Voice-AI-Test-Suite

featured: true
draft: false
---

## Overview

Automated testing tool that replaces manual call testing of voice AI systems. A synthetic AI customer calls your voice AI via SIP, conducts a full conversation, and produces structured pass/fail results with transcripts and scores.
## What I built

- A Testing framework for Voice AI through call (integration with genesys).
- For Evaulation of Voice AI.
- Flow testing, intent testing, and final evaulation based on the conversation.

## Next steps

- STT transcribes per RTP chunk instead of per full utterance — UtteranceBuffer fix pending
- React UI not yet built — use API directly
