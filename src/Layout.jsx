import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getCurrentTitle = () => {
    const currentRoute = routeArray.find(route => route.path === location.pathname);
    return currentRoute?.label || 'ClassHub';
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFB]">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <h1 className="text-xl font-heading font-semibold text-primary">
              {getCurrentTitle()}
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
              />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 w-64 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
              <ApperIcon name="Bell" size={20} className="text-surface-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-surface-200 z-40">
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary border-l-4 border-primary ml-0 pl-2'
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="mt-8 p-4 bg-surface-50 rounded-lg">
              <h3 className="text-sm font-semibold text-surface-700 mb-2">
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm text-surface-600">
                <div className="flex justify-between">
                  <span>Total Students</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span>Today's Attendance</span>
                  <span className="font-medium text-success">96%</span>
                </div>
                <div className="flex justify-between">
                  <span>Class Average</span>
                  <span className="font-medium text-info">B+</span>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={closeMobileMenu}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl"
              >
                <div className="p-4 border-b border-surface-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-heading font-semibold text-primary">
                      ClassHub
                    </h2>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                            isActive
                              ? 'bg-primary/10 text-primary border-l-4 border-primary ml-0 pl-2'
                              : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={20} />
                        <span className="font-medium">{route.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-full">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;