import React, { useState, useEffect } from 'react';
import {
    Users, Settings, TrendingUp, DollarSign, MessageSquare, Calendar, Heart,
    Shield, Ban, Edit, AlertTriangle, CheckCircle, XCircle, Clock, BarChart3, 
    PieChart, Mail, UserCheck, UserX, Activity, Globe, Smartphone, Tablet, Monitor
} from 'lucide-react';

const AdminDashboard () => {
    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSeletedFilter] = useState('all');
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock admin data - replace with reeal API calls
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalUsers: 12347,
            activeUsers: 9923,
            newUsersToday: 146,
            totalRevenue: 45678,
            monthlyRevenue: 67889,
            totalPosts: 34567,
            totalMessages: 123654,
            reportedContent: 235
        },
        recentUsers: [
            {
                id: '1',
                name: 'Jane Doe',
                email: 'https://example.com/janedoe',
                avatar: '',
                membership: 'Diamond',
                status: 'active',
                lastLogin: '2025-01',
                joinDate: new Date('2025-01-01'),
                location: 'New Yourk, USA',
                totalSpent: 299.00,
                reportsAgainst: 0,
                postsCount: 35,
                messagesCount: 121
            },
            {
                id: '2',
                name: 'John Doe',
                email: 'mike@example.com',
                avatar: '',
                membership: 'Gold',
                status: 'banned',
                lastLogin: '2025-04',
                joinData: new Date('2025-11-01'),
                location: 'Los Angeles, USA',
                totalSpent: 199.87,
                reportsAgainst: 3,
                postsCount: 11,
                messagesCount: 44,
            },
            {
                id: '3',
                name: 'Autumn Smith',
                email: 'autumn@example.com',
                avatar: '',
                membership: 'Free',
                status: 'active',
                lastLogin: '2025-05',
                joinDate: new Date('2025-05-15'),
                location: 'Chicago, USA',
                totalSpent: 0.00,
                reportsAgainst: 1,
                postsCount: 5,
                messagesCount: 11,
            }
        ],
        recentPayments: [
            {
                id: 'pay_1',
                userId: '1',
                userName: 'JaneDoe',
                amount: 43.00,
                membership: 'Diamond',
                billingCycle: 'monthly',
                date: new Date(Date.now() - 86400000 * 2),
                status: 'completed',
                paymentMethod: 'paypal'
            },
            {
                id: 'pay_2',
                userId: '2',
                userName: 'JohnDoe',
                amount: 29.00,
                membership: 'Gold',
                billingCycle: 'monthly',
                date: new Date(Date.now() - 86400000 * 5),
                status: 'pending',
                paymentMethod: 'credit_card'
            },
            {
                reportedContent: [
                    {
                        id: 'report_1',
                        type: 'post',
                        contentId: 'post_123',
                        reportedBy: 'user_456',
                        reason: 'Inappropriate content',
                        description: 'Contains offensive language',
                        date: new Date(Date.now() - 86400000 * 1),
                        status: 'under_review',
                        severity: 'medium'
                    },
                    {
                        id: 'report_2',
                        type: 'message',
                        contentId: 'msg_789',
                        reportedBy: 'user_321',
                        reason: 'Spam',
                        description: 'Unsolicited promotional message',
                        date: new Date(Date.now) - 86400000 * 3,
                        status: 'resolved',
                        severity: 'low'
                    }
                ]
            }
        ]
    });

    // Simulate API calls
    useEffect(() => {
        // Loading dashboard data
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
        }, 1000);

        const handleUserAction = async (userId, action) => {
            try {
                setLoading(true);

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Update user status locally
                setDashboardData(prev => ({
                    ...prev,
                    recentUsers: prev.recentUsers.map(user => 
                        user.id === userId ? { ...user, status: action === 'suspend' ? 'suspended' : 'active' }
                        : user
                    )
                }));

                alert('User ${action}ed successfully');
            } catch (error) {
                alert('Failed to ${action} user. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const handleContentModeration = async (reportId, action) => {
            try {
                setLoading(true)

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Update report status
                setDashboardData(prev => ({
                    ...prev,
                    reportedContent: prev.reportedContent.map(report => 
                        report.id === reportId ? { ...report, status: action === 'resolve' ? 'resolved' : 'under_review' }
                    )
                }));

                alert('Content ${action} successfully');
            } catch (error) {
                alert('Failed to ${action} content');
            } finally {
                setLoading(false);
            }
        };

        const getMembershipBadge = (membership) => {
            const badges = {
                free: { color: 'bg-gray-500', icon: null, text: 'Free' },
                gold: { color: 'bg-yellow-500', icon: Crown, text: 'Gold' },
                platinum: { color: 'bg-gray-400', icon: 'Crown', text: 'Platinum' },
                diamond: { color: 'bg-blue-500', icon: Diamond, text: 'Diamond' }
            };

            const badge = badges[membership];
            const IconComponent = badge.icon;

            return (
                <span className={'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold text-white ${badge.color}'}>
                    {IconComponent && <IconComponent className="w-3 h-3"/>}
                    <span>{badge.text}</span>
                </span>
            );
        };

        const getStatusBadge = (status) => {
            const statuses = {
                active: { color: 'bg-green-100', text: 'green-800', icon: CheckCircle, text: 'Active' },
                suspended: { color: 'bg-yellow-100', text: 'yellow-800', icon: XCircle, text: 'Suspended' },
                banned: { color: 'bg-red-100', text: 'red-800', icon: Ban, text: 'Banned' },
                pending: { color: 'bg-yellow-100', text: 'yellow-800', icon: Clock, text: 'Pending' }
            };

            const statusConfig = statuses[status];
            const IconComponent = statusConfig.icon;

            return (
                <span className={'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}'}>
                    <IconComponent className="w-3 h-3"/>
                    <span>{statusConfig.text}</span>
                </span>
            );
        };

        const formatCurreny = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);;
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numberic',
                month: 'short',
                day: 'numberic'
            });
        };

        const formatTimeAgo = (date) => {
            const now = new Date();
            const diff = now - date;
            const minutes = Match.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 60) return '${minutes}m ago';
            if (hours < 24) return '${hours}h ago';
            return '${days}d ago';
        };

        const StatCard = ({ title, value, icon: Icon, change, changeType = 'positive' }) => (
            <div className="bg-white rounded-xl shadow-lg p-6 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{value}
                        {changeType === 'positive' ? '+' : ''}{change}% since last month</p>
                    </div>
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-3">
                        <Icon className="w-6 h-6 text-white"/>
                </div>
            </div>
            </div>
        );

        const OverviewTab = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardData.stats.totalUsers.toLocaleString()}
          icon={Users}
          change="12% this month"
          changeType="positive"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(dashboardData.stats.monthlyRevenue)}
          icon={DollarSign}
          change="8% this month"
          changeType="positive"
        />
        <StatCard
          title="Active Users"
          value={dashboardData.stats.activeUsers.toLocaleString()}
          icon={Activity}
          change="5% this week"
          changeType="positive"
        />
        <StatCard
          title="Reported Content"
          value={dashboardData.stats.reportedContent}
          icon={AlertTriangle}
          change="3 new today"
          changeType="negative"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Revenue Overview</span>
          </h3>
          <div className="h-64 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600">Chart placeholder</p>
              <p className="text-sm text-gray-500">Integration with Chart.js recommended</p>
            </div>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-pink-600" />
            <span>User Growth</span>
          </h3>
          <div className="h-64 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <p className="text-gray-600">Chart placeholder</p>
              <p className="text-sm text-gray-500">Integration with Chart.js recommended</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span>Recent Payments</span>
          </h3>
          <div className="space-y-3">
            {dashboardData.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{payment.userName}</p>
                  <p className="text-sm text-gray-600">{getMembershipBadge(payment.membership)} • {payment.billingCycle}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(payment.amount)}</p>
                  <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Content Reports</span>
          </h3>
          <div className="space-y-3">
            {dashboardData.reportedContent.map((report) => (
              <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{report.reason}</span>
                  {getStatusBadge(report.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">by {report.reportedBy}</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(report.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Users</option>
              <option value="free">Free</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getMembershipBadge(user.membership)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>Last: {formatTimeAgo(user.lastActive)}</div>
                    <div className="text-gray-500">{user.postsCount} posts, {user.messagesCount} messages</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(user.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                        className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'payments', name: 'Payments', icon: DollarSign },
    { id: 'content', name: 'Content', icon: MessageSquare },
    { id: 'reports', name: 'Reports', icon: Shield },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Flirting Singles Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, Admin
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-gray-700">Processing...</span>
              </div>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getMembershipBadge(selectedUser.membership)}
                        {getStatusBadge(selectedUser.status)}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{selectedUser.postsCount}</div>
                      <div className="text-sm text-gray-600">Posts Created</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{selectedUser.messagesCount}</div>
                      <div className="text-sm text-gray-600">Messages Sent</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{formatCurrency(selectedUser.totalSpent)}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{selectedUser.reportsAgainst}</div>
                      <div className="text-sm text-gray-600">Reports Against</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleUserAction(selectedUser.id, selectedUser.status === 'active' ? 'suspend' : 'activate')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                        selectedUser.status === 'active'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
                    </button>
                    <button className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                      Send Message
                    </button>
                    <button className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium">
                      View Activity
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
}

export default AdminDashboard;