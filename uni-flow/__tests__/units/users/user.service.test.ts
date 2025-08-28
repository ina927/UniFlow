import { createUser, deleteUser, getUserById, getUsers, Role, updateUser, UserStatus } from "@/entities";

// Mock the User model
jest.mock("@/shared/models/user", () => {
  const mockUser = {
    _id: "1",
    name: "Test User",
    email: "test@example.com",
    role: "STUDENT" as Role,
    status: "ACTIVE" as UserStatus,
    dob: new Date(2000, 0, 1),
    hash: "$2b$10$8X7z5t7i7z5t7i7z5t7i7u",
    save: jest.fn(),
    toJSON: jest.fn().mockReturnThis()
  };

  return {
    User: {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    },
    mockUser // Export mockUser for use in tests
  };
});

// Mock mongoose connection
jest.mock("@/shared/lib/mongoose", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined)
}));

// Import the mocked User and mockUser
const { User, mockUser } = jest.requireMock('@/shared/models/user');

describe("User Service", () => {
  beforeEach(() => {
    // Reset all mocks and set up default implementations
    jest.clearAllMocks();
    
    // Set up default mock implementations
    User.find.mockResolvedValue([mockUser]);
    User.findById.mockResolvedValue(mockUser);
    User.create.mockResolvedValue(mockUser);
    User.findByIdAndUpdate.mockResolvedValue(mockUser);
    User.findByIdAndDelete.mockResolvedValue(mockUser);
  });
  
  it("should get all users", async () => {
    const users = await getUsers();
    expect(users).toBeDefined();
    expect(users).toEqual([mockUser]);
  });

  it("should get a user by id", async () => {
    const user = await getUserById("1");
    expect(user).toBeDefined();
    expect(user).toEqual(mockUser);
  });

  it("should create a user", async () => {
    const userData = {
      name: "Test User",
      role: "STUDENT" as Role,
      email: "test@example.com",
      hash: "$2b$10$8X7z5t7i7z5t7i7z5t7i7u",
      dob: new Date(2000, 0, 1),
      status: "ACTIVE" as UserStatus,
    };
    const user = await createUser(userData);
    expect(user).toBeDefined();
    expect(user).toEqual(mockUser);
  });

  it("should update a user", async () => {
    const updateData = {
      name: "Updated Name",
    };
    const user = await updateUser("1", updateData);
    expect(user).toBeDefined();
  });

  it("should delete a user", async () => {
    const user = await deleteUser("1");
    expect(user).toBeDefined();
  });
});
