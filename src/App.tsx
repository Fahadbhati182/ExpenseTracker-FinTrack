import { Toaster } from 'react-hot-toast';
import AddExpensePage from "./pages/AddExpense"
import { Route, Routes } from 'react-router-dom';
import { TopNavbar } from './components/TopNavbar';
import AllExpensesPage from './pages/AllExpense';
import ExpenseDetailsPage from './pages/ExpenseDetails';
import DashboardPage from './pages/DashboardPage';
import CreateProfile from './pages/CreateProfile';

const App = () => {
  return (
    <div className="
      flex 
      flex-col       
      lg:flex-row     
      bg-[#0b120d] 
      text-white 
      min-h-screen 
      w-full
      overflow-x-hidden
    ">
      <Toaster />


      <div
        className="
          flex-1 flex flex-col w-full px-4 sm:px-6 lg:px-16 xl:px-24 2xl:px-40"
      >
        <TopNavbar />

        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/expenses" element={<AllExpensesPage />} />
            <Route path="/expenses/:id" element={<ExpenseDetailsPage />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/add-expense" element={<AddExpensePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
