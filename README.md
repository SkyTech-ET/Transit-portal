# Transit Portal - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Project Structure](#project-structure)
6. [Architecture Overview](#architecture-overview)
7. [Development Workflow](#development-workflow)
8. [Key Features](#key-features)
9. [API Integration](#api-integration)
10. [Authentication & Authorization](#authentication--authorization)
11. [State Management](#state-management)
12. [Component Patterns](#component-patterns)
13. [Styling & UI](#styling--ui)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)
16. [Contributing](#contributing)

---

## 🚀 Project Overview

**Transit Portal** is a comprehensive web application built for managing transit and logistics operations. It provides a modern, responsive interface for various user roles including administrators, customers, managers, assessors, and case executors.

### Key Capabilities:
- **User Management**: Complete user lifecycle management with role-based access
- **Service Management**: Create, track, and manage transit services
- **Customer Portal**: Dedicated interface for customer operations
- **Document Management**: Upload, verify, and manage service documents
- **Real-time Notifications**: Stay updated with service status changes
- **Reporting**: Generate and export service reports

---

## 🛠 Technology Stack

### Frontend Technologies
- **[Next.js 14](https://nextjs.org/docs)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library with hooks and modern patterns
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Ant Design](https://ant.design/)** - Enterprise UI component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[DaisyUI](https://daisyui.com/)** - Tailwind CSS component library
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **[Axios](https://axios-http.com/)** - HTTP client for API requests
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Lint-staged](https://github.com/okonet/lint-staged)** - Pre-commit linting

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **VS Code** (recommended) - Code editor with extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd transit-portal
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn (recommended)
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Transit Portal
NEXT_PUBLIC_APP_VERSION=1.0.0

# Development Configuration
NODE_ENV=development
```

### 4. Start Development Server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production
```bash
# Using npm
npm run build
npm start

# Using yarn
yarn build
yarn start
```

---

## 📁 Project Structure

```
transit-portal/
├── app/                          # Next.js 13+ App Router
│   ├── admin/                    # Admin dashboard pages
│   │   ├── dashboard/            # Dashboard components
│   │   ├── mot/                  # MOT system pages
│   │   │   ├── customers/        # Customer management
│   │   │   │   ├── services/     # Customer services
│   │   │   │   └── create/       # Customer creation
│   │   │   ├── services/         # Service management
│   │   │   └── components/       # MOT-specific components
│   │   ├── user/                 # User management
│   │   │   ├── components/       # User components
│   │   │   └── edit/             # User editing
│   │   ├── components/           # Shared admin components
│   │   │   ├── layout/           # Layout components
│   │   │   └── forms/            # Form components
│   │   └── layout.tsx            # Admin layout wrapper
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   └── layout.tsx            # Auth layout
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── modules/                      # Feature-based modules
│   ├── mot/                      # MOT system module
│   │   ├── service/              # Service-related code
│   │   │   ├── service.types.ts  # TypeScript interfaces
│   │   │   ├── service.endpoints.ts # API endpoints
│   │   │   ├── service.store.ts  # Zustand store
│   │   │   └── index.ts          # Module exports
│   │   ├── customer/             # Customer-related code
│   │   ├── document/             # Document-related code
│   │   └── index.ts              # MOT module exports
│   ├── user/                     # User management module
│   │   ├── user.types.ts         # User interfaces
│   │   ├── user.endpoints.ts     # User API endpoints
│   │   ├── user.store.ts         # User state management
│   │   └── user.routes.ts        # User routes
│   ├── role/                     # Role management module
│   ├── common/                   # Common utilities
│   └── utils/                    # Utility modules
│       ├── auth/                 # Authentication utilities
│       ├── permission/           # Permission management
│       ├── token/                # Token management
│       ├── axios/                # HTTP client
│       └── index.ts              # Utils exports
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   ├── icons/                    # Icon assets
│   └── favicon.ico               # Favicon
├── styles/                       # Additional styles
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## 🏗 Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (ASP.NET)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Architecture Layers

#### 1. **Presentation Layer** (Components)
- **Page Components**: Top-level page components
- **Feature Components**: Reusable feature-specific components
- **UI Components**: Generic UI components (buttons, forms, tables)

#### 2. **State Management Layer** (Zustand Stores)
- **Global State**: Application-wide state management
- **Feature State**: Module-specific state management
- **Local State**: Component-level state (useState)

#### 3. **API Layer** (HTTP Client)
- **Endpoint Definitions**: Centralized API endpoint management
- **HTTP Client**: Axios-based HTTP client with interceptors
- **Type Safety**: TypeScript interfaces for API requests/responses

#### 4. **Utility Layer**
- **Authentication**: JWT token management
- **Permissions**: Role-based access control
- **Routing**: Navigation and route management
- **Validation**: Form and data validation

---

## 🔄 Development Workflow

### 1. **Feature Development Process**

#### Step 1: Define Types
```typescript
// modules/feature/feature.types.ts
export interface IFeature {
  id: number;
  name: string;
  status: FeatureStatus;
}

export interface IFeaturePayload {
  name: string;
  description: string;
}
```

#### Step 2: Create API Endpoints
```typescript
// modules/feature/feature.endpoints.ts
const featureEndpoints = Object.freeze({
  getAll: '/Feature/GetAll',
  create: '/Feature/Create',
  update: '/Feature/Update',
  delete: '/Feature/Delete'
});

export const getAllFeatures = (): Promise<Response> => {
  return http.get({ url: featureEndpoints.getAll });
};
```

#### Step 3: Implement State Management
```typescript
// modules/feature/feature.store.ts
const useFeatureStore = create<IFeatureStore>((set, get) => ({
  features: [],
  loading: false,
  error: null,
  
  getAllFeatures: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllFeatures();
      set({ features: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

#### Step 4: Create Components
```typescript
// app/admin/feature/page.tsx
const FeaturePage = () => {
  const { features, loading, getAllFeatures } = useFeatureStore();
  
  useEffect(() => {
    getAllFeatures();
  }, []);
  
  return (
    <div>
      <Table dataSource={features} loading={loading} />
    </div>
  );
};
```

### 2. **Code Organization Principles**

#### **Separation of Concerns**
- **Components**: UI and user interactions
- **Stores**: State management and business logic
- **Endpoints**: API communication
- **Types**: Type definitions and interfaces

#### **Feature-Based Organization**
- Group related functionality together
- Each module is self-contained
- Clear boundaries between modules

#### **Reusability**
- Generic components for common UI patterns
- Shared utilities and hooks
- Consistent API patterns

---

## ✨ Key Features

### 1. **User Management**
- **User Registration**: Create new users with role assignment
- **User Editing**: Update user information and roles
- **Role Management**: Assign and manage user roles
- **Profile Management**: User profile updates and settings

### 2. **Service Management**
- **Service Creation**: Create new transit services
- **Service Tracking**: Monitor service status and progress
- **Service Assignment**: Assign services to case executors and assessors
- **Service Updates**: Update service information and status

### 3. **Customer Portal**
- **Service Requests**: Customers can create service requests
- **Service Tracking**: View service status and progress
- **Document Upload**: Upload required documents
- **Communication**: Send messages and receive notifications

### 4. **Document Management**
- **Document Upload**: Upload service-related documents
- **Document Verification**: Verify document authenticity
- **Document Download**: Download documents for review
- **Document Types**: Support for various document types

### 5. **Notification System**
- **Real-time Updates**: Receive notifications for status changes
- **Message System**: Send and receive messages
- **Email Notifications**: Email alerts for important events
- **In-app Notifications**: Dashboard notifications

---

## 🔌 API Integration

### HTTP Client Configuration
```typescript
// modules/utils/axios/service.ts
import axios from 'axios';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      logout();
    }
    return Promise.reject(error);
  }
);
```

### API Endpoint Patterns
```typescript
// Standard CRUD operations
export const getAllItems = (filters?: IFilters): Promise<Response> => {
  return http.get({ url: '/Item/GetAll', params: filters });
};

export const getItemById = (id: number): Promise<Response> => {
  return http.get({ url: `/Item/GetById/${id}` });
};

export const createItem = (payload: IItemPayload): Promise<Response> => {
  return http.post({ url: '/Item/Create', data: payload });
};

export const updateItem = (id: number, payload: IItemPayload): Promise<Response> => {
  return http.put({ url: `/Item/Update/${id}`, data: payload });
};

export const deleteItem = (id: number): Promise<Response> => {
  return http.delete({ url: `/Item/Delete/${id}` });
};
```

---

## 🔐 Authentication & Authorization

### Authentication Flow
```typescript
// modules/utils/auth/auth.store.ts
const useAuthStore = create<IAuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: async (credentials: ILoginCredentials) => {
    try {
      const response = await login(credentials);
      const { user, token } = response.data;
      
      // Store token and user data
      setToken(token);
      setUser(user);
      
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    removeToken();
    removeUser();
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
```

### Permission-Based Access Control
```typescript
// modules/utils/permission/permission.store.ts
const usePermissionStore = create<IPermissionStore>((set, get) => ({
  permissions: [],
  isAdmin: false,
  
  checkPermission: (permission: string): boolean => {
    const { permissions, isAdmin } = get();
    return isAdmin || permissions.includes(permission);
  },
  
  hasRole: (roleName: string): boolean => {
    const { currentUser } = get();
    return currentUser?.roles?.some(role => role.roleName === roleName) || false;
  }
}));
```

### Route Protection
```typescript
// app/admin/layout.tsx
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkPermission } = usePermissionStore();
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }
  
  return <div>{children}</div>;
};
```

---

## 🗃 State Management

### Zustand Store Pattern
```typescript
// modules/feature/feature.store.ts
interface IFeatureStore {
  // State
  items: IFeature[];
  currentItem: IFeature | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  getAllItems: () => Promise<void>;
  getItemById: (id: number) => Promise<void>;
  createItem: (payload: IFeaturePayload) => Promise<void>;
  updateItem: (id: number, payload: IFeaturePayload) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

const useFeatureStore = create<IFeatureStore>((set, get) => ({
  // Initial state
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  
  // Actions
  getAllItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllFeatures();
      set({ items: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  createItem: async (payload: IFeaturePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await createFeature(payload);
      const newItem = response.data;
      
      // Update local state
      set(state => ({
        items: [...state.items, newItem],
        loading: false
      }));
      
      message.success('Item created successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      message.error('Failed to create item');
    }
  }
}));
```

### State Management Best Practices

#### **1. Single Source of Truth**
- Each piece of data has one authoritative source
- Avoid duplicating state across components

#### **2. Immutable Updates**
- Always create new objects/arrays when updating state
- Use spread operator for object updates

#### **3. Loading States**
- Track loading states for better UX
- Show loading indicators during API calls

#### **4. Error Handling**
- Centralized error handling in stores
- User-friendly error messages

---

## 🧩 Component Patterns

### 1. **Page Component Pattern**
```typescript
const FeaturePage = () => {
  // 1. Hooks and State
  const router = useRouter();
  const { items, loading, getAllItems, deleteItem } = useFeatureStore();
  const { checkPermission } = usePermissionStore();
  
  // 2. Local State
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filters, setFilters] = useState({});
  
  // 3. Effects
  useEffect(() => {
    getAllItems();
  }, []);
  
  // 4. Event Handlers
  const handleCreate = () => {
    router.push('/admin/features/create');
  };
  
  const handleEdit = (id: number) => {
    router.push(`/admin/features/edit/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id);
      message.success('Item deleted successfully');
    } catch (error) {
      message.error('Failed to delete item');
    }
  };
  
  // 5. Render
  return (
    <div className="p-6">
      <Card
        title="Features"
        extra={
          <Button type="primary" onClick={handleCreate}>
            Create Feature
          </Button>
        }
      >
        <Table
          dataSource={items}
          loading={loading}
          columns={columns}
          rowKey="id"
          pagination={{
            total: items.length,
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  );
};
```

### 2. **Form Component Pattern**
```typescript
const FeatureForm = ({ isEdit, payload }: IFeatureFormProps) => {
  // 1. Form Setup
  const [form] = Form.useForm();
  const router = useRouter();
  
  // 2. Store Hooks
  const { createItem, updateItem, loading } = useFeatureStore();
  
  // 3. Effects
  useEffect(() => {
    if (isEdit && payload) {
      form.setFieldsValue({
        name: payload.name,
        description: payload.description,
      });
    }
  }, [isEdit, payload]);
  
  // 4. Submit Handler
  const handleSubmit = async (values: any) => {
    try {
      if (isEdit) {
        await updateItem(payload.id, values);
        message.success('Feature updated successfully');
      } else {
        await createItem(values);
        message.success('Feature created successfully');
      }
      
      router.push('/admin/features');
    } catch (error) {
      message.error('Operation failed');
    }
  };
  
  // 5. Render
  return (
    <div className="p-6">
      <Card title={isEdit ? 'Edit Feature' : 'Create Feature'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={loading}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="Enter feature name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => router.back()}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
```

### 3. **Reusable Component Pattern**
```typescript
interface IDataTableProps<T> {
  dataSource: T[];
  columns: ColumnType<T>[];
  loading?: boolean;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onView?: (record: T) => void;
}

const DataTable = <T extends { id: number }>({
  dataSource,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onView
}: IDataTableProps<T>) => {
  const actionColumn: ColumnType<T> = {
    title: 'Actions',
    key: 'actions',
    render: (_, record: T) => (
      <Space>
        {onView && (
          <Button
            type="link"
            icon={<Eye size={16} />}
            onClick={() => onView(record)}
          >
            View
          </Button>
        )}
        {onEdit && (
          <Button
            type="link"
            icon={<Edit size={16} />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => onDelete(record)}
          >
            <Button
              type="link"
              danger
              icon={<Trash size={16} />}
            >
              Delete
            </Button>
          </Popconfirm>
        )}
      </Space>
    ),
  };

  const finalColumns = [...columns, actionColumn];

  return (
    <Table
      dataSource={dataSource}
      columns={finalColumns}
      loading={loading}
      rowKey="id"
      pagination={{
        total: dataSource.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  );
};
```

---

## 🎨 Styling & UI

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
}
```

### Component Styling Patterns
```typescript
// Custom styled components
const StyledCard = styled(Card)`
  .ant-card-head {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .ant-card-head-title {
    color: white;
  }
`;

// Tailwind utility classes
const FeatureCard = ({ feature }: { feature: IFeature }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      {feature.name}
    </h3>
    <p className="text-gray-600 mb-4">{feature.description}</p>
    <div className="flex justify-between items-center">
      <Tag color={getStatusColor(feature.status)}>
        {getStatusText(feature.status)}
      </Tag>
      <Button type="primary" size="small">
        View Details
      </Button>
    </div>
  </div>
);
```

### Responsive Design
```typescript
// Responsive layout patterns
const ResponsiveGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {children}
  </div>
);

// Mobile-first approach
const MobileFirstLayout = () => (
  <div className="p-4 md:p-6 lg:p-8">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3">
        {/* Sidebar */}
      </div>
      <div className="w-full md:w-2/3">
        {/* Main content */}
      </div>
    </div>
  </div>
);
```

---

## 🚀 Deployment

### 1. **Build for Production**
```bash
# Install dependencies
yarn install

# Build the application
yarn build

# Start production server
yarn start
```

### 2. **Environment Variables for Production**
```env
# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_NAME=Transit Portal
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

### 3. **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 4. **Vercel Deployment**
```json
// vercel.json
{
  "buildCommand": "yarn build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "@api_base_url"
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
yarn build

# Clear node_modules and reinstall
rm -rf node_modules
yarn install
```

#### 2. **TypeScript Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
yarn add -D @types/node @types/react @types/react-dom
```

#### 3. **API Connection Issues**
```typescript
// Check API base URL
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

// Verify CORS settings on backend
// Check network tab in browser dev tools
```

#### 4. **Authentication Issues**
```typescript
// Check token storage
const token = localStorage.getItem('token');
console.log('Stored token:', token);

// Verify token format
const tokenParts = token?.split('.');
console.log('Token parts:', tokenParts?.length);
```

#### 5. **State Management Issues**
```typescript
// Debug Zustand store
const useDebugStore = create((set, get) => ({
  // ... store implementation
  debug: () => {
    console.log('Current state:', get());
  }
}));
```

### Performance Optimization

#### 1. **Bundle Analysis**
```bash
# Analyze bundle size
yarn add -D @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... existing config
});
```

#### 2. **Image Optimization**
```typescript
import Image from 'next/image';

// Optimized image loading
<Image
  src="/images/feature.jpg"
  alt="Feature image"
  width={300}
  height={200}
  priority // For above-the-fold images
/>
```

#### 3. **Code Splitting**
```typescript
// Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});
```

---

## 🤝 Contributing

### Development Guidelines

#### 1. **Code Style**
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

#### 2. **Git Workflow**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/new-feature
```

#### 3. **Testing**
```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

#### 4. **Pull Request Guidelines**
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

---

## 📚 Additional Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ant Design Components](https://ant.design/components/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Learning Resources
- [Next.js Learn Course](https://nextjs.org/learn)
- [React Patterns](https://reactpatterns.com/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Modern JavaScript Features](https://javascript.info/)

---

## 📞 Support

For questions, issues, or contributions:

1. **Check the documentation** - Most questions are answered here
2. **Search existing issues** - Your issue might already be reported
3. **Create a new issue** - Provide detailed information about your problem
4. **Join the discussion** - Participate in community discussions

---

**Happy Coding! 🚀**

This documentation is continuously updated. Please check back regularly for the latest information and best practices.#   T r a n s i t - p o r t a l  
 