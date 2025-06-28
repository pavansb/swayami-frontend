#!/bin/bash

echo "🚀 Setting up Swayami local development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    print_error "Python is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

# Install concurrently for running both frontend and backend
print_status "Installing concurrently for running both services..."
npm install --save-dev concurrently

# Set up backend environment
print_status "Setting up backend environment..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv 2>/dev/null || python -m venv venv
fi

# Activate virtual environment and install dependencies
print_status "Installing backend dependencies..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # macOS/Linux
    source venv/bin/activate
fi

# Install Python dependencies
pip install -r requirements.txt

# Create .env file from example
if [ ! -f ".env" ]; then
    print_status "Creating backend .env file..."
    cp env.example .env
    print_warning "Please update the .env file with your OpenAI API key and MongoDB URI"
fi

cd ..

# Create frontend .env file for development
if [ ! -f ".env.development.local" ]; then
    print_status "Creating frontend .env file..."
    cat > .env.development.local << EOF
VITE_API_BASE_URL=http://localhost:8000
VITE_ENVIRONMENT=development
EOF
fi

print_status "Setup complete! 🎉"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your OpenAI API key"
echo "2. Make sure MongoDB is running (or use MongoDB Atlas)"
echo "3. Start the development servers:"
echo ""
echo "   # Option 1: Start both frontend and backend together"
echo "   npm run start:full"
echo ""
echo "   # Option 2: Start them separately"
echo "   # Terminal 1 (Backend):"
echo "   cd backend && source venv/bin/activate && python main.py"
echo ""
echo "   # Terminal 2 (Frontend):"
echo "   npm run dev"
echo ""
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:8000"
echo "📚 API Documentation will be available at: http://localhost:8000/docs"
echo ""
print_warning "Default login credentials:"
echo "Email: contact.pavansb@gmail.com"
echo "Password: test123" 