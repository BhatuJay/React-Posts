import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { RootLayout } from './components/RootLayout';
import { Home } from './pages/Home'
import { Login } from './pages/Login';
import { PostDetails } from './pages/PostDetails';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><RootLayout /></ProtectedRoute>,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/postdetails/:id",
        element: <PostDetails />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  }
])

function App() {
  return (
    <>
      <RouterProvider router={routes} />
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App