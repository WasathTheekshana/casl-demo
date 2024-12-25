# Node.js CASL Authorization Demo

This project demonstrates the implementation of attribute-based access control (ABAC) using CASL in a Node.js application with TypeScript, Express, and MongoDB.

## What is CASL?

CASL (pronounced "castle") is an isomorphic authorization library that restricts what resources a user is allowed to access. It's designed to be incrementally adoptable and can manage access rights across your application. The library implements Attribute Based Access Control (ABAC) using a "subject over action" mental model.

## Features

- 👤 User authentication with JWT
- 🔐 Role-based access control (RBAC)
- 📝 Post management system
- 🔑 Different permissions for admin and regular users
- 🗄️ MongoDB integration
- 📜 TypeScript support

## Project Structure

```
src/
├── abilities/       # CASL ability definitions
├── controllers/     # Route controllers
├── middleware/      # Express middlewares
├── models/         # Mongoose models
└── routes/         # Express routes
```

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-name]
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
HOST=localhost
PORT=8080
JWT_SECRET_KEY=thisisthesecret
MONGO_URI=mongodb://admin:admin@localhost:27017
MONGODB_DB_NAME=casl_demo
```

5. Start the development server:
```bash
yarn dev
```

## CASL Implementation

### Ability Definition

The project defines abilities based on user roles:

```typescript
const defineAbilityFor = (user: IUser) => 
  defineAbility(can => {
    if (user.role === "admin") {
      can("manage", "all");
      return;
    }

    // Regular users
    can("read", "Post");
    can(["create", "update", "delete"], "Post", { author: user._id });
    can("read", "User", { _id: user._id });
    can("update", "User", { _id: user._id });
  });
```

### Permission Structure

- **Admin Users:**
  - Can manage all resources
  - Full access to all operations

- **Regular Users:**
  - Can read all posts
  - Can create posts
  - Can update and delete their own posts
  - Can read and update their own profile

## API Endpoints

### Authentication

```bash
# Register a new user
POST /auth/register
{
  "email": "wasath@example.com",
  "password": "password123",
  "role": "user" // By default this role is `user`
}

# Login
POST /auth/login
{
  "email": "wasath@example.com",
  "password": "password123"
}
```

### Posts

```bash
# Create a post (requires authentication)
POST /posts
{
  "title": "Wasath's Adventures",
  "content": "This is all about Wasath's Adventures"
}

# Update a post (requires authentication and proper permissions)
PUT /posts/:id
{
  "title": "Wasath F*ed up bruh!",
  "content": "Lol this is the updated content"
}
```

## Testing Permissions

You can test different permission scenarios:

1. Create an admin user
2. Create a regular user
3. Try to:
   - Create posts as different users
   - Update posts as different users
   - Access posts as different users

## Error Handling

The application includes error handling for:
- Invalid authentication
- Unauthorized access
- Resource not found
- Validation errors
- Server errors

## Security Considerations

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- Role-based access control is implemented using CASL
- MongoDB connection is secured

## Future Enhancements

Possible improvements and additions:
- Add refresh tokens
- Implement email verification
- Add more granular permissions
- Add user groups and team permissions
- Implement API rate limiting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.