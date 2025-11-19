
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom"
import { AppProvider } from './context/AppContext.tsx'
import { ExpenseProvider } from './context/ExpenseContext.tsx'


createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <AppProvider>
        <ExpenseProvider>
          <App />
        </ExpenseProvider>
      </AppProvider>
    </BrowserRouter>
  </>,
)
