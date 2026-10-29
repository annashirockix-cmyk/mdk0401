import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Создаем роутер с указанием базового пути
export const router = createRouter({
  routeTree,
  basepath: '/mdk0401/', // Тот же путь, что и в vite.config.ts
  defaultPreload: 'intent',
  scrollRestoration: true,
})

// Регистрируем типы для TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
