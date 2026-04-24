# Graph.sys & BFHL API Challenge (Bajaj Assignment)

A full-stack application built for the Bajaj (BFHL) API Challenge. It consists of an Express.js backend that serves as a Directed Graph Engine and a sleek, Mailgoose-inspired Next.js frontend that visualizes the graph structures.

## 🚀 Project Overview

1. **Backend (Directed Graph Engine)**: An API capable of parsing string-based graph edges (e.g., `A->B`, `X->Y`), determining hierarchies, detecting pure cycles, computing maximum graph depths, identifying root nodes, and flagging duplicate or invalid entries.
2. **Frontend (Graph.sys)**: A clean, modern dark-themed Next.js UI using `ReactFlow` and `dagre` layout algorithms to visually map the backend's hierarchy structures, complete with a glass-morphic interface and a smooth user experience.

---

## 🛠️ Technologies Used

### Frontend (`/front-end`)
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS (v4)
- **Visualization**: React Flow (`reactflow`), Dagre (`dagre`) for auto-layout
- **Animations**: GSAP (`@gsap/react`)
- **HTTP Client**: Axios

### Backend (`/backend`)
- **Framework**: Node.js with Express.js
- **Environment config**: Dotenv
- **CORS**: `cors` package to communicate with the Next.js port

---

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Setting up the Backend
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the Express server (Runs on port 5001 by default)
npm run dev
```
*Note: Make sure your `.env` file is located at `backend/src/.env` to correctly populate the `user_id`, `email`, and `roll_number` endpoints. If not found, it will automatically fallback to default dummy data.*

### 2. Setting up the Frontend
```bash
# Open a new terminal and navigate to the frontend directory
cd front-end

# Install dependencies
npm install

# Start the Next.js dev server (Runs on port 3000)
npm run dev
```

### 3. Usage
- Once both servers are running, open your browser and navigate to `http://localhost:3000`.
- In the "Design your graph edges" field, input your edges separated by commas or newlines (e.g., `A->B, B->C, C->D, X->Y, Y->X`).
- Click **Run Analysis** to see the parsed properties, validations, and interactive graph visualizations.

---

## 📡 API Reference

### `POST /bfhl`
Processes the directed edges and calculates hierarchies.

**Request Payload:**
```json
{
  "data": ["A->B", "A->C", "B->D", "c-e", "X->Y", "Y->X"]
}
```

**Response Payload:**
```json
{
  "user_id": "KiranPrasadNeupane_26112004",
  "email_id": "kn3959@srmist.edu.in",
  "college_roll_number": "RA2311003012373",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "B": { "D": {} }, "C": {} },
      "depth": 3
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": ["c-e"],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

## 🔒 License
Private / Assignment Submission. All rights reserved.
