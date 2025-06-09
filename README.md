# Diamond Lab Store

A beautiful lab diamond store with admin panel built with FastAPI backend and React frontend, featuring Hebrew RTL design.

## Features

### Customer Features
- Browse diamond catalog with advanced filtering
- View detailed diamond specifications (carat, color, clarity, cut, shape)
- User registration and authentication
- Mobile-responsive Hebrew RTL interface

### Admin Features
- Complete product management (CRUD operations)
- Category management with image upload
- Price editing and inventory management
- Image upload and editing capabilities
- User management
- Dashboard with statistics

### Technical Features
- FastAPI backend with SQLAlchemy ORM
- React frontend with Tailwind CSS
- JWT authentication with admin authorization
- Database migrations with Alembic
- File upload with validation
- Hebrew RTL design throughout
- Mobile-first responsive design

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## Quick Start

### 1. Initial Setup

Run the setup script to install all dependencies and configure the database:

```bash
setup.bat
```

This will:
- Create Python virtual environment
- Install backend dependencies
- Set up database migrations
- Install frontend dependencies
- Create environment configuration file

### 2. Start the Application

```bash
start.bat
```

This will:
- Activate virtual environment
- Run database migrations
- Start backend server (http://localhost:8001)
- Start frontend server (http://localhost:3001)

### 3. Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

## Manual Setup

If you prefer to set up manually:

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r ../requirements.txt
alembic upgrade head
python main.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Database Management

### Create New Migration

```bash
migrate.bat create "description of changes"
```

### Apply Migrations

```bash
migrate.bat upgrade
```

### Other Migration Commands

```bash
migrate.bat current    # Show current revision
migrate.bat history    # Show migration history
migrate.bat downgrade  # Downgrade by one revision
```

## Configuration

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```env
# Database
DATABASE_URL=sqlite:///./diamond_store.db

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3001

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Database Options

#### SQLite (Default)
```env
DATABASE_URL=sqlite:///./diamond_store.db
```

#### PostgreSQL
```env
DATABASE_URL=postgresql://username:password@localhost/diamond_store
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/{id}` - Update category (Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin)

### Products
- `GET /api/products` - List products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### File Upload
- `POST /api/upload` - Upload image (Admin)

## Database Schema

### Users
- id, email, username, full_name, phone
- hashed_password, is_active, is_admin
- created_at

### Categories
- id, name, description, image_url
- is_active, created_at

### Products
- id, name, description, price, image_url
- carat_weight, color_grade, clarity_grade, cut_grade
- shape, certificate_number
- is_available, category_id, created_at

## Diamond Specifications

### Color Grades
D, E, F, G, H, I, J (D being colorless, J having slight color)

### Clarity Grades
FL (Flawless), IF (Internally Flawless), VVS1, VVS2, VS1, VS2, SI1, SI2

### Cut Grades
Excellent, Very Good, Good, Fair, Poor

### Common Shapes
Round, Princess, Emerald, Asscher, Oval, Radiant, Cushion, Marquise, Pear, Heart

## Development

### Project Structure

```
DiamondLabStore/
├── backend/
│   ├── alembic/          # Database migrations
│   ├── uploads/          # Uploaded files
│   ├── main.py           # FastAPI application
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── crud.py           # Database operations
│   ├── auth.py           # Authentication
│   └── database.py       # Database configuration
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── context/      # React context
│   └── public/
├── requirements.txt      # Python dependencies
├── setup.bat            # Initial setup script
├── start.bat            # Start servers script
└── migrate.bat          # Database migration script
```

### Adding New Features

1. **Backend Changes**:
   - Update models in `models.py`
   - Create migration: `migrate.bat create "description"`
   - Apply migration: `migrate.bat upgrade`
   - Update schemas in `schemas.py`
   - Add CRUD operations in `crud.py`
   - Add API endpoints in `main.py`

2. **Frontend Changes**:
   - Create/update components in `src/components/`
   - Add pages in `src/pages/`
   - Update routing in `src/App.js`

## Troubleshooting

### Common Issues

1. **Virtual environment not found**
   - Run `setup.bat` to create the virtual environment

2. **Database migration errors**
   - Check if models are properly imported in `alembic/env.py`
   - Ensure database file permissions are correct

3. **Frontend build errors**
   - Delete `node_modules` and run `npm install` again
   - Check Node.js version (requires 16+)

4. **CORS errors**
   - Update `ALLOWED_ORIGINS` in `.env` file
   - Ensure frontend and backend URLs match

### Logs

- Backend logs: Check the terminal where `python main.py` is running
- Frontend logs: Check the terminal where `npm start` is running
- Database logs: Check Alembic output during migrations

## Deployment

### Production Considerations

1. **Security**:
   - Change `SECRET_KEY` to a strong random string
   - Use HTTPS in production
   - Set up proper CORS origins
   - Use environment variables for sensitive data

2. **Database**:
   - Use PostgreSQL for production
   - Set up database backups
   - Configure connection pooling

3. **File Storage**:
   - Use cloud storage (AWS S3, etc.) for uploaded files
   - Configure CDN for better performance

4. **Server**:
   - Use production WSGI server (Gunicorn)
   - Set up reverse proxy (Nginx)
   - Configure SSL certificates

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the project repository. 