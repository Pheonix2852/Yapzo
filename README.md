![Project Cover](assets/Mockup.png)

# Yapzo

**A modern, Expo‑based React Native app** that combines **Stream Chat** and **Stream Video** with **Clerk** authentication, delivering a seamless social‑messaging and video‑calling experience.

---

## 🚀 What the Project Does

Yapzo provides a mobile‑first platform where users can:

- Sign in with Clerk and instantly see their profile avatar.
- Browse a tab‑based interface for exploring chats, profiles, and settings.
- Send and receive real‑time chat messages via Stream Chat.
- Initiate and join high‑quality video calls using Stream Video.
- Enjoy a polished UI built with **NativeWind** and a consistent orange‑themed design.

---

## 🛠 Tech Stack

- **Frontend**: React Native (Expo SDK 54), NativeWind/Tailwind, TypeScript
- **Authentication**: Clerk (`useUser` hook)
- **Chat & Video**: Stream Chat SDK, Stream Video React Native SDK
- **State Management**: React Context (`src/context/AppProvider.tsx`)
- **Styling**: Tailwind CSS, custom theme (`src/lib/theme.ts`)
- **Build & Dev**: Expo CLI, Metro bundler, EAS for builds
- **Testing / Linting**: ESLint, Jest
- **Version Control**: Git

---

## ✨ Features

- **Clerk authentication** with avatar display on the home screen.
- **Tab navigation** (Explore, Profile, etc.) using Expo router.
- **Real‑time chat** powered by Stream Chat, including message composer and attachment handling.
- **Video calling** with incoming/outgoing call screens and Stream Video integration.
- **Themed UI** – custom orange palette defined in `src/lib/theme.ts` and applied across components.
- **Responsive design** via NativeWind utilities.
- **Hot‑reload friendly** development workflow (Expo Go, Metro bundler).

---

## 💡 Why This Project is Useful

Yapzo showcases how to combine **authentication**, **real‑time messaging**, and **video calling** in a single React Native app, making it an excellent reference for developers building social or collaboration platforms. It demonstrates best practices for:

- Managing multiple SDKs (Clerk, Stream) together.
- Structuring a scalable codebase with clear context providers.
- Applying a consistent design system using Tailwind and a custom theme.
- Leveraging Expo’s tooling for rapid iteration.
