import App from '@/App'
import ItemsPage from '@/pages/ItemsPage'
import { createBrowserRouter } from 'react-router-dom'


const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/items', element: <ItemsPage /> }
])

export default router