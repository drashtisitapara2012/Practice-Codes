import bcrypt from 'bcryptjs';

// In-memory user storage (in production, use a database)
interface User {
    id: string;
    name: string;
    email: string;
    password: string; // hashed password
    image?: string;
    createdAt: Date;
}

class UserStore {
    private users: User[] = [];

    async createUser(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<User> {
        // Check if user already exists
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create new user
        const newUser: User = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        // Store user
        this.users.push(newUser);

        // Return user without password
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword as User;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const user = this.users.find(u => u.email === email);
        return user || null;
    }

    async validatePassword(email: string, password: string): Promise<User | null> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return null;
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    }

    async getUserById(id: string): Promise<User | null> {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            return null;
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    }

    // For demo purposes - get all users (without passwords)
    getAllUsers(): Omit<User, 'password'>[] {
        return this.users.map(({ password, ...user }) => user);
    }
}

// Export singleton instance
export const userStore = new UserStore();
