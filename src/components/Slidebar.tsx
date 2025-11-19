import React from 'react'

const Slidebar = () => {
  return (
    <aside className="flex flex-col w-64 bg-[#111813] p-4 shrink-0 border-r border-[#2a3a30]">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="bg-center bg-cover rounded-full size-12"
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkJkjeX5Z8Q9GWwRuM0abS7Ztgh3QkLOobJcF8q1MuGSWl8T4L_fFpUMe36FkAPrbfBrZa4rWQVQUdrihmovmdoWbmP6J8DGEEP792VjjuAPNI0DN7xEGVTqieqKtXnlkMlrFzvBDA3bR-x-xrk9ppot9QIJ-o7MpUwNH1tIqjaeGKE5FOrOjxKp9AjT7dbbSJCa3rFbZ1cR8VXMJJTrh6EoGnMQ2GmBzkcsyq0URWYncEYPKYgAfvy5LL0eVNrUh8Rf9JD0ooiejg')` }}
        />
        <div>
          <p className="font-medium">John Doe</p>
          <p className="text-sm text-[#9db9a6]">john.doe@email.com</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 mt-4 text-sm">
        <a className="px-3 py-2 text-white/70 hover:text-white transition-colors" href="#">Dashboard</a>
        <a className="px-3 py-2 bg-[#1c271f] rounded text-[#4de17b]" href="#">Expenses</a>
        <a className="px-3 py-2 text-white/70 hover:text-white transition-colors" href="#">Reports</a>
        <a className="px-3 py-2 text-white/70 hover:text-white transition-colors" href="#">Settings</a>
      </nav>

      <div className="mt-auto">
        <a className="px-3 py-2 text-white/70 hover:text-white transition-colors text-sm" href="#">Log Out</a>
      </div>
    </aside>
  )
}

export default Slidebar