# Project Title

dinamo task to view data of posts in table

## Installation

Instructions on how to install and set up the project.

```bash
# Clone the repository
git clone https://github.com/Khaled-Gammal/dinmo-task.git

# Navigate to the project directory
cd dinmo-task

# Install dependencies
npm install --force 

# Start the development server
npm run dev

# Build for production
npm run build


# project structure

.

├── app         # Next.js pages
│   ├── page.js # Home page
│   ├── loading.js  # Loading page server
│   ├── layout.js  
├── components    # Reusable UI components
│   ├── shared # Reusable UI components
│   ├── tables # View tables data and columns of data
        └── tables-posts #view posts data
        └── constatnt-data  #conatant array of field for add form and update
│   ├── hooks  #i use familiar hooks and i made Custom hooks for reusable add, edit, and delete dialog in all project
├── lib         # Utility functions
│   ├── actions # Action server function requests
│   ├── reducer # Set values of field
│   ├── types # Types of data for TypeScript 
│   └── validation.js # Reusable function for check validation and required 
└── README.md     # Project documentation