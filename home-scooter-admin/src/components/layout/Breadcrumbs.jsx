import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  dashboard: 'Dashboard',
  ads: 'All Ads',
  pending: 'Pending Approvals',
  banners: 'Banner Ads',
  create: 'Create Banner',
  subscriptions: 'Subscriptions',
  users: 'Users Management',
  leads: 'Callback Leads',
  reports: 'Reported Ads',
  'visitor-win': 'Visitor Win',
  analytics: 'Analytics',
  settings: 'Settings',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>/</span>
        <span className="text-slate-800 font-semibold">Dashboard Overview</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
      <Link to="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
        <Home className="w-3.5 h-3.5 text-slate-400" />
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = routeNameMap[value] || (value.startsWith('AD') || value.startsWith('SUB') || value.startsWith('USR') || value.startsWith('REP') ? `#${value}` : value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            {isLast ? (
              <span className="text-slate-800 font-semibold">{name}</span>
            ) : (
              <Link to={to} className="hover:text-blue-600 transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
