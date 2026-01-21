# 📊 Attendly - Smart Attendance Tracker

Attendly is a sleek, responsive, and feature-rich web application designed to help students track their class attendance with precision. It doesn't just count days; it provides actionable insights like how many classes you can "safely skip" or how many you "must attend" to reach your target percentage.

![Attendly Dashboard Placeholder](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000)

## ✨ Features

- **🎯 Smart Goal Tracking**: Set a target percentage (e.g., 75%) and get real-time feedback on your standing.
- **📈 Advanced Analytics**:
  - **"Safe to Skip"**: Calculates exactly how many upcoming classes you can miss without dropping below your target.
  - **"Attend More"**: Calculates exactly how many consecutive classes you need to attend to get back on track.
- **📅 Detailed History**: A built-in calendar view for every subject to manage past attendance, including support for:
  - **Present** (Green)
  - **Absent** (Red)
  - **OD (On Duty)** (Blue) - Counts as attended but tracked separately.
  - **Holiday** (Amber) - Ignored in percentage calculations.
- **🎨 Stunning UI & Customization**:
  - **Modern Theme**: Clean, professional, and vibrant.
  - **Retro Theme**: A nostalgic, high-contrast "hacker" aesthetic with monospace fonts.
  - **Dark/Light Mode**: Full system and manual toggle support.
- **🔒 Privacy First**: All data is stored locally in your browser (LocalStorage). No servers, no tracking, just your data.
- **📱 Fully Responsive**: Works perfectly on desktops, tablets, and smartphones.

## 🛠️ Tech Stack

- **React 19**: Modern component-based architecture.
- **Tailwind CSS**: Utility-first styling with custom theme configurations.
- **TypeScript**: Robust type-checking for attendance logic and state management.
- **ES Modules**: Fast, lightweight loading via ESM.sh.

## 🚀 Getting Started

Since Attendly is a client-side application, you can run it without any heavy backend setup.

1. **Clone the repo**:
   ```bash
   git clone https://github.com/zafrose3/Attendly.git
   ```
2. **Open the project**:
   Simply open the `index.html` file in any modern web browser, or use a live server extension (like VS Code Live Server) for the best experience.

## 💡 How it Works

The attendance logic follows these rules:
- **Attendance % Formula**: `(Present + OD) / (Present + Absent + OD) * 100`
- **Sundays**: Automatically handled. Marking "Absent" on a Sunday does not penalize your percentage (ideal for tracking personal study schedules).
- **On Duty (OD)**: Recognized as "Attended" for the percentage calculation but labeled as OD for record-keeping.

## 📸 Screenshots

| Modern Dark Mode | Retro Light Mode |
| :---: | :---: |
| ![Modern Dark](https://via.placeholder.com/400x250?text=Modern+Dark+Mode) | ![Retro Light](https://via.placeholder.com/400x250?text=Retro+Light+Mode) |

---

Developed with ❤️ by [Amrisha](https://github.com/zafrose3)