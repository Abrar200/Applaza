import React, { useState, useMemo } from 'react';
import { AlertTriangle, Flag, Ban, CheckCircle, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Report {
  id: number;
  type: string;
  content: string;
  reporter: string;
  reportedUser: string;
  status: 'pending' | 'resolved' | 'investigating' | 'dismissed';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
}

const initialReports: Report[] = [
  { id: 1, type: 'video', content: 'Inappropriate product demo', reporter: 'user_1234', reportedUser: 'creator_abc', status: 'pending', severity: 'high', timestamp: '2025-10-26T10:30:00' },
  { id: 2, type: 'comment', content: 'Spam links in comments', reporter: 'user_5678', reportedUser: 'user_xyz', status: 'resolved', severity: 'low', timestamp: '2025-10-26T09:15:00' },
  { id: 3, type: 'user', content: 'Fake product listings', reporter: 'user_9012', reportedUser: 'seller_123', status: 'investigating', severity: 'critical', timestamp: '2025-10-26T08:00:00' },
  { id: 4, type: 'video', content: 'Misleading product claims', reporter: 'user_3456', reportedUser: 'creator_def', status: 'pending', severity: 'medium', timestamp: '2025-10-26T07:45:00' },
];

export default function ModerationView() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<{ type: string; reportId: number } | null>(null);

  const metrics = useMemo(() => {
    return {
      critical: reports.filter(r => r.severity === 'critical' && r.status !== 'resolved' && r.status !== 'dismissed').length,
      high: reports.filter(r => r.severity === 'high' && r.status !== 'resolved' && r.status !== 'dismissed').length,
      medium: reports.filter(r => r.severity === 'medium' && r.status !== 'resolved' && r.status !== 'dismissed').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
    };
  }, [reports]);

  const handleApprove = (reportId: number) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'dismissed' as const } : r
    ));
    toast.success('Content approved - report dismissed');
  };

  const handleRemoveContent = (reportId: number) => {
    setDialogAction({ type: 'remove', reportId });
    setDialogOpen(true);
  };

  const handleBanUser = (reportId: number) => {
    setDialogAction({ type: 'ban', reportId });
    setDialogOpen(true);
  };

  const handleInvestigate = (reportId: number) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'investigating' as const } : r
    ));
    toast.info('Report marked as under investigation');
  };

  const confirmAction = () => {
    if (!dialogAction) return;

    const { type, reportId } = dialogAction;
    const report = reports.find(r => r.id === reportId);

    if (type === 'remove') {
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: 'resolved' as const } : r
      ));
      toast.success('Content removed successfully');
    } else if (type === 'ban') {
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: 'resolved' as const } : r
      ));
      toast.success(`User ${report?.reportedUser} has been banned`);
    }

    setDialogOpen(false);
    setDialogAction(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Moderation & Trust/Safety</h1>
        <p className="text-sm sm:text-base text-gray-400">Review flagged content and user reports</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <p className="text-gray-400 text-xs sm:text-sm">Critical</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{metrics.critical}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            <p className="text-gray-400 text-xs sm:text-sm">High</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{metrics.high}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <p className="text-gray-400 text-xs sm:text-sm">Medium</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{metrics.medium}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <p className="text-gray-400 text-xs sm:text-sm">Resolved</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{metrics.resolved}</p>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 hover:border-red-500/50 transition-all">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                    report.severity === 'critical' ? 'bg-red-500 text-white' :
                    report.severity === 'high' ? 'bg-orange-500 text-white' :
                    report.severity === 'medium' ? 'bg-yellow-500 text-black' :
                    'bg-blue-500 text-white'
                  }`}>
                    {report.severity.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm capitalize">{report.type}</span>
                  <span className="text-gray-500 text-xs">{new Date(report.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-white text-sm sm:text-lg mb-2">{report.content}</p>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs sm:text-sm">
                  <p className="text-gray-400">Reporter: <span className="text-gray-300">{report.reporter}</span></p>
                  <p className="text-gray-400">Reported User: <span className="text-red-400">{report.reportedUser}</span></p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                report.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                report.status === 'investigating' ? 'bg-blue-500/20 text-blue-400' :
                report.status === 'dismissed' ? 'bg-gray-500/20 text-gray-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {report.status}
              </span>
            </div>
            {report.status !== 'resolved' && report.status !== 'dismissed' && (
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleApprove(report.id)}
                  className="bg-green-500/20 text-green-400 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-xs sm:text-sm font-semibold"
                >
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Approve
                </button>
                <button 
                  onClick={() => handleInvestigate(report.id)}
                  className="bg-blue-500/20 text-blue-400 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-xs sm:text-sm font-semibold"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Investigate
                </button>
                <button 
                  onClick={() => handleRemoveContent(report.id)}
                  className="bg-red-500/20 text-red-400 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-xs sm:text-sm font-semibold"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Remove
                </button>
                <button 
                  onClick={() => handleBanUser(report.id)}
                  className="bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm font-semibold"
                >
                  <Ban className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Ban User
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {dialogAction?.type === 'ban' ? 'Ban User?' : 'Remove Content?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {dialogAction?.type === 'ban' 
                ? 'This will permanently ban the user from the platform. This action cannot be undone.'
                : 'This will remove the reported content. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAction}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
