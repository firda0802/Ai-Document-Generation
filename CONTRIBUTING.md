# 🤝 Contributing to MYDOCMAKER

First off, thank you for considering contributing to **MYDOCMAKER**! It's people like you that make this project such a great tool for the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.0 or higher
- **npm**, **yarn**, or **bun**
- **Git**

### Setting Up Your Development Environment

1. **Fork the Repository**
   
   Click the "Fork" button at the top right of the repository page.

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mydocmaker.git
   cd mydocmaker
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/mydocmaker.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## 💡 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**When reporting a bug, include:**

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node version)
- Any relevant console errors

### ✨ Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When suggesting an enhancement, include:**

- A clear and descriptive title
- A detailed description of the proposed feature
- Any possible implementation details
- Why this enhancement would be useful

### 🔧 Code Contributions

#### Good First Issues

Looking for something to work on? Check out issues labeled:

- `good first issue` - Simple issues for newcomers
- `help wanted` - Issues where we need community help
- `documentation` - Documentation improvements

#### Areas Where We Need Help

| Area | Description |
|------|-------------|
| 🎨 **UI/UX** | Improving user interface and experience |
| 🧪 **Testing** | Adding unit and integration tests |
| 📚 **Documentation** | Improving README, adding tutorials |
| 🌍 **i18n** | Adding internationalization support |
| ♿ **Accessibility** | Improving a11y compliance |
| 🚀 **Performance** | Optimizing loading times and bundle size |
| 🔌 **Integrations** | Adding new AI providers or export formats |

---

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names:

```
feature/add-new-ai-tool
bugfix/fix-pdf-export
docs/update-readme
refactor/improve-auth-flow
```

### Development Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Add comments where necessary
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   npm run build
   npm run preview
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

---

## 🎨 Style Guidelines

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Add JSDoc comments for public functions

```typescript
// ✅ Good
const generateDocument = async (prompt: string): Promise<Document> => {
  // Implementation
};

// ❌ Bad
function genDoc(p) {
  // Implementation
}
```

### React Components

- Use **functional components** with hooks
- Use **TypeScript interfaces** for props
- Keep components small and focused
- Extract reusable logic into custom hooks

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};
```

### CSS/Tailwind

- Use **Tailwind CSS** utility classes
- Follow the existing design system tokens in `index.css`
- Use semantic color tokens (`--primary`, `--secondary`, etc.)
- Keep custom CSS to a minimum

### File Organization

```
src/
├── components/     # Reusable components
├── pages/          # Route pages
├── hooks/          # Custom hooks
├── lib/            # Utility functions
├── contexts/       # React contexts
└── data/           # Static data
```

---

## 📝 Commit Messages

We follow the **Conventional Commits** specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code changes that neither fix bugs nor add features |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Examples

```bash
feat(document): add PDF export functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
refactor(api): simplify edge function logic
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code builds without errors (`npm run build`)
- [ ] All existing tests pass
- [ ] New features have been tested manually
- [ ] Documentation has been updated if needed
- [ ] Commit messages follow conventions

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
```

### Review Process

1. A maintainer will review your PR
2. You may be asked to make changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

---

## 🏆 Recognition

Contributors will be recognized in:

- The project README
- Release notes
- Our contributors page

---

## 📞 Need Help?

- **Email**: [maheerkhan3a@gmail.com](mailto:maheerkhan3a@gmail.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/mydocmaker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/mydocmaker/discussions)

---

<div align="center">
  <sub>Thank you for contributing to MYDOCMAKER! 🚀</sub>
</div>
