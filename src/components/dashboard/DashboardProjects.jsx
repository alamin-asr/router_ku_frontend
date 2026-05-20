import { useState, useEffect } from 'react';
import { FolderKanban, Code2, Trophy, Loader2 } from 'lucide-react';
import { projectsApi } from '../../api/services';

export default function DashboardProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await projectsApi.getAll();
        const data = res.data?.data || res.data?.content || res.data;
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full min-w-0">
      <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">Club Projects</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl space-y-2">
          <FolderKanban size={36} className="text-gray-300 mx-auto" />
          <p className="text-gray-400 dark:text-gray-500 text-sm">No projects listed yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map(p => {
            const techList = p.techStack || p.tech || [];
            return (
              <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs">{p.category}</span>
                  <span className="text-xs text-gray-400">{p.year}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-1">{p.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{p.team}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {techList.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                      <Code2 size={9} />
                      {t}
                    </span>
                  ))}
                </div>
                {p.achievement && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-1.5">
                    <Trophy size={11} />
                    {p.achievement}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
