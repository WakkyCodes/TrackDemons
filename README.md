# 🚀 Track Demons

A blazing-fast 3D car game built with React, Three.js, and Vite. Get ready for a world of dynamic racing, thrilling stunts, and high-energy physics!

---

## 🚀 Live Demo

You can play the live version of the game right in your browser!

**[➡️ Click here to play! 🏎️💨](https://wakkycodes.github.io/TrackDemons/)**



---

## 🏁 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have **Node.js** (version 18.x or later), **npm**, and **Git LFS** installed on your system.

-   [Node.js](https://nodejs.org/)
-   [Git LFS](https://git-lfs.com/)

### Installation & Setup

Follow these simple steps to get the development environment running:

1.  **Clone the repository**
    ```sh
    git clone [https://github.com/wakkycodes/TrackDemons.git](https://github.com/wakkycodes/TrackDemons.git)
    ```

2.  **Retrieve LFS objects (models, textures, etc.)**
    ```sh
    git lfs install
    git lfs pull
    ```
    > Without this step, you may see placeholder text files instead of the actual game assets.

3.  **Navigate to the project directory**
    ```sh
    cd trackdemons
    ```

4.  **Install dependencies**
    ```sh
    npm install
    ```
    > **Note on `npm ci`**: While you mentioned `npm ci`, it's best to use `npm install` for local development. `npm ci` is mainly for automated environments (like GitHub Actions) to ensure a clean, exact install from the `package-lock.json` file.

5.  **Run the development server**
    ```sh
    npm run dev
    ```
    Your project should now be running on `http://localhost:5173` (or the next available port).

---

## 🎮 Controls

| Key | Action |
| :--- | :--- |
| `W` / `ArrowUp` | Accelerate Forward |
| `S` / `ArrowDown`| Brake / Reverse |
| `A` / `ArrowLeft`| Turn Left |
| `D` / `ArrowRight`| Turn Right |

---

## 🛠️ Tech Stack

This project is built with a modern, high-performance tech stack:

-   **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
-   **[Vite](https://vitejs.dev/):** A next-generation frontend tooling that provides a faster and leaner development experience.
-   **[Three.js](https://threejs.org/):** The core 3D library for creating and displaying animated 3D graphics in a web browser.
-   **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber):** A React renderer for Three.js, making it easy to build 3D scenes declaratively.
-   **[React Three Cannon](https://docs.pmnd.rs/react-three-cannon):** Physics bindings for React Three Fiber, enabling realistic object interactions.
-   **[TypeScript](https://www.typescriptlang.org/):** A typed superset of JavaScript that compiles to plain JavaScript.

---

## 🗺️ Roadmap

Here are some of the features planned for the future:

-   [x] Basic car physics and keyboard controls
-   [ ] Stunt ramps, loops, and dynamic obstacles
-   [x] UI for speedometer and race info
-   [x] Multiple camera modes (First-person, Cinematic)
-   [x] Sound effects for engine, collisions, and environment
-   [x] Selection of different car models

---
