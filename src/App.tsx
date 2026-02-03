
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './BonusCSS/loadingCSS.css'
import React, { useEffect, Suspense } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'

const Badges = React.lazy(() => import("./pages/Badges"));
const Cards = React.lazy(() => import("./pages/Cards"));
const UserColorSchemesComp = React.lazy(() => import("./components/UserColorSchemesComp"));
import { SubLayout } from './components/SubLayout'
import { FormComponent } from './components/SignIn'
import { Provider } from './components/ui/provider'
import { authStateStore } from './store/projectStore'
import { ProtectedRoute } from './components/ProtectedRoute'

import { LoadingRoller } from './components/LoadingRoller'
const router = createBrowserRouter([
  {
    path: "/", element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "sign-in", element: <FormComponent type="sign-in" />,
        errorElement: <h2>Oops! Page not found or crashed.</h2>
      },
      {
        path: "sign-up", element: <FormComponent type="sign-up" />,
        errorElement: <h2>Oops! Page not found or crashed.</h2>
      },
      {
        path: "my-color-schemes", element: <ProtectedRoute><UserColorSchemesComp /> </ProtectedRoute>,
        errorElement: <h2>Oops! Page not found or crashed.</h2>
      },
      {
        element: <SubLayout />,
        children: [
          { path: "badges", element: <Badges /> },

          { path: "cards", element: <Cards /> },
        ]
      }
    ]
  }
])
const queryClient = new QueryClient()
function App() {

  const initAuth = authStateStore(state => state.initAuth)
  useEffect(() => {
    const runInitAuth = async () => {
      try {
        initAuth()
      } catch (err) {
        console.log(err)
      }
    }
    runInitAuth()
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider>
          <Suspense fallback={<LoadingRoller />}>
            <RouterProvider router={router} />
          </Suspense>
        </Provider>
      </QueryClientProvider>
    </>
  )
}

export default App
