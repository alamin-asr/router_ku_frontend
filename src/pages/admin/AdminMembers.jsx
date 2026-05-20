import { useState, useMemo } from 'react';
import { useApi } from '../../hooks/useApi';
import { adminApi } from '../../api/services';
import { Search, Shield, User, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const PAGE_SIZE = 15;

export default function AdminMembers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);

  // Fetch all members once
  const { data, loading } = useApi(() => adminApi.getMembers(), []);
  const allMembers = Array.isArray(data) ? data : (data?.content || []);

  // Client-side filtering by search + role
  const filtered = useMemo(() => {
    let list = allMembers;

    // Filter by role
    if (roleFilter) {
      list = list.filter(u => u.role?.toUpperCase() === roleFilter);
    }

    // Filter by search (name or email)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allMembers, roleFilter, search]);

  // Client-side pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const members = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Counts for filter badges
  const adminCount = allMembers.filter(u => u.role?.toUpperCase() === 'ADMIN').length;
  const memberCount = allMembers.filter(u => u.role?.toUpperCase() !== 'ADMIN').length;

  const filters = [
    { val: '', label: 'All', count: allMembers.length },
    { val: 'ADMIN', label: 'Admin', count: adminCount },
    { val: 'MEMBER', label: 'Member', count: memberCount },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 w-full min-w-0">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-500 text-sm mt-1">{allMembers.length} total registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search by name or email..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(r => (
            <button key={r.val} onClick={() => { setRoleFilter(r.val); setPage(0); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${roleFilter === r.val ? 'bg-blue-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {r.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleFilter === r.val ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{r.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><Loader2 size={24} className="animate-spin text-blue-600 mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Member', 'Department', 'Batch', 'Joined', 'Role'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)}</div>
                        <div><div className="text-sm font-medium text-gray-900">{u.name}</div><div className="text-xs text-gray-400">{u.email}</div></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.department || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.batch || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{u.joinDate || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role === 'ADMIN' ? <><Shield size={9} className="inline mr-1" />Admin</> : <><User size={9} className="inline mr-1" />Member</>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && members.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No members found.</div>}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-400">Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
