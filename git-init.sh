#!/bin/bash

# Git Initialization Script for DiamondLabStore
echo "🔧 Initializing Git repository for DiamondLabStore..."

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: DiamondLabStore project

- Python FastAPI backend with SQLAlchemy
- React frontend with Tailwind CSS
- Complete authentication system
- Image upload functionality
- Admin panel
- Database migrations with Alembic
- Production deployment scripts
- Linux setup automation"

echo "✅ Git repository initialized!"
echo ""
echo "Next steps:"
echo "1. Create a repository on GitHub/GitLab"
echo "2. Add remote origin:"
echo "   git remote add origin <your-repository-url>"
echo "3. Push to remote:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "To set up on Linux server:"
echo "1. Clone the repository"
echo "2. Run: chmod +x setup-linux.sh"
echo "3. Run: ./setup-linux.sh" 