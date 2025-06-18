import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShieldIcon,
  UserIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  ScanSearch,
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AddAccountModal from '../components/account/AddAccountModal';
import EditAccountModal from '../components/account/EditAccountModal';
import ViewAccountModal from '../components/account/ViewAccountModal';
import DeleteAccountModal from '../components/account/DeleteAccountModal';
import avatar from '../assets/img/default-avatar.png';

const Account = () => {
  const [activeTab, setActiveTab] = useState('admins');
  const [admins, setAdmins] = useState([
    {
      _id: 'a1',
      full_name: 'Trần Văn B',
      phone_number: '0912345678',
      password: 'hashed_password',
      email: 'admin@example.com',
      avatar_url: avatar,
      date_of_birth: '1985-01-01',
      gender: 'Nam',
      role: 'super_admin',
      status: 'active',
      created_at: '2025-05-21T23:00:00Z',
    },
    {
      _id: 'a2',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'active',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a3',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'active',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a4',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'active',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a5',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'active',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a6',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'deleted',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a7',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'active',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a8',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'inactive',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a9',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'active',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a10',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'active',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a11',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'active',
      created_at: '2025-05-20T10:00:00Z',
    },
    {
      _id: 'a12',
      full_name: 'Nguyễn Thị D',
      phone_number: '0923456789',
      password: 'hashed_password',
      email: 'admin2@example.com',
      avatar_url: avatar,
      date_of_birth: '1987-03-15',
      gender: 'Nữ',
      role: 'admin',
      status: 'active',
      created_at: '2025-05-20T10:00:00Z',
    },
  ]);
  const [users, setUsers] = useState([
    {
      _id: 'u1',
      full_name: 'Nguyễn Văn A',
      phone_number: '0901234567',
      email: 'user@example.com',
      password: 'hashed_password',
      avatar_url: avatar,
      date_of_birth: '1990-01-01',
      gender: 'Nam',
      tour_history: [{ tour_id: 't1', departure_id: 'd1', booking_id: 'b1', status: 'completed' }],
      favorite_tours: [{ tour_id: 't1' }],
      status: 'active',
      created_at: '2025-05-21T23:00:00Z',
    },
    {
      _id: 'u2',
      full_name: 'Lê Thị E',
      phone_number: '0934567890',
      email: 'user2@example.com',
      password: 'hashed_password',
      avatar_url: avatar,
      date_of_birth: '1992-05-20',
      gender: 'Nữ',
      tour_history: [],
      favorite_tours: [],
      status: 'active',
      created_at: '2025-05-19T15:30:00Z',
    },
  ]);
  const [guides, setGuides] = useState([
    {
      _id: 'g1',
      full_name: 'Lê Thị C',
      phone_number: '0912345678',
      email: 'guide@example.com',
      avatar_url: avatar,
      date_of_birth: '1988-01-01',
      gender: 'Nữ',
      password: 'hashed_password',
      past_assignments: [{ assignment_id: 'ta1' }],
      status: 'active',
      created_at: '2025-05-21T23:00:00Z',
    },
    {
      _id: 'g2',
      full_name: 'Phạm Văn F',
      phone_number: '0945678901',
      email: 'guide2@example.com',
      avatar_url: avatar,
      date_of_birth: '1985-08-10',
      gender: 'Nam',
      password: 'hashed_password',
      past_assignments: [],
      status: 'active',
      created_at: '2025-05-18T09:00:00Z',
    },
  ]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const accountsPerPage = 10;

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    password: '',
    avatar_url: '',
    date_of_birth: '',
    gender: '',
    status: 'active',
    role: 'admin',
  });

  const getCurrentAccounts = () => {
    switch (activeTab) {
      case 'admins':
        return admins;
      case 'users':
        return users;
      case 'guides':
        return guides;
      default:
        return [];
    }
  };

  useEffect(() => {
    const currentAccounts = getCurrentAccounts();
    let filtered = [...currentAccounts];

    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.phone_number.includes(searchTerm),
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((account) => account.status === statusFilter);
    }

    setFilteredAccounts(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, activeTab, admins, users, guides]);

  const handleAddAccount = () => {
    const newAccount = {
      ...formData,
      _id: `${activeTab.slice(0, 1)}${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    switch (activeTab) {
      case 'admins':
        setAdmins([...admins, newAccount]);
        break;
      case 'users':
        setUsers([...users, { ...newAccount, tour_history: [], favorite_tours: [] }]);
        break;
      case 'guides':
        setGuides([...guides, { ...newAccount, past_assignments: [] }]);
        break;
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateAccount = () => {
    if (!currentAccount) return;

    switch (activeTab) {
      case 'admins':
        setAdmins(admins.map((admin) => (admin._id === currentAccount._id ? { ...admin, ...formData } : admin)));
        break;
      case 'users':
        setUsers(users.map((user) => (user._id === currentAccount._id ? { ...user, ...formData } : user)));
        break;
      case 'guides':
        setGuides(guides.map((guide) => (guide._id === currentAccount._id ? { ...guide, ...formData } : guide)));
        break;
    }

    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteAccount = () => {
    if (!currentAccount) return;

    const updatedAccount = {
      ...currentAccount,
      status: 'deleted',
      deleted_at: new Date().toISOString(),
    };

    switch (activeTab) {
      case 'admins':
        setAdmins(admins.map((admin) => (admin._id === currentAccount._id ? updatedAccount : admin)));
        break;
      case 'users':
        setUsers(users.map((user) => (user._id === currentAccount._id ? updatedAccount : user)));
        break;
      case 'guides':
        setGuides(guides.map((guide) => (guide._id === currentAccount._id ? updatedAccount : guide)));
        break;
    }

    setShowDeleteModal(false);
    setDeleteReason('');
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      phone_number: '',
      email: '',
      password: '',
      avatar_url: '',
      date_of_birth: '',
      gender: '',
      status: 'active',
      role: 'admin',
    });
    setCurrentAccount(null);
  };

  const openEditModal = (account) => {
    setCurrentAccount(account);
    setFormData({ ...account });
    setShowEditModal(true);
  };

  const openViewModal = (account) => {
    setCurrentAccount(account);
    setShowViewModal(true);
  };

  const openDeleteModal = (account) => {
    setCurrentAccount(account);
    setShowDeleteModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'deleted':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Tạm khóa';
      case 'deleted':
        return 'Đã xóa';
      default:
        return status;
    }
  };

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'admins':
        return 'Quản trị viên';
      case 'users':
        return 'Người dùng';
      case 'guides':
        return 'Hướng dẫn viên';
      default:
        return '';
    }
  };

  const getAccountIcon = (tab) => {
    switch (tab) {
      case 'admins':
        return <ShieldIcon className="h-4 w-4" />;
      case 'users':
        return <UserIcon className="h-4 w-4" />;
      case 'guides':
        return <MapPinIcon className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

  return (
    <div className="container mx-auto py-8 px-5">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {['admins', 'users', 'guides'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === tab ? 'bg-blue-700 text-white hover:bg-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab)}
              disabled={tab === 'guides' && activeTab !== 'guides' ? true : false}
            >
              {getAccountIcon(tab)} {getTabTitle(tab)}
            </Button>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 cursor-pointer">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm khóa</SelectItem>
                {/* <SelectItem value="deleted">Đã xóa</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-100 shadow-sm hover:shadow-md hover:bg-gray-100 text-black flex items-center gap-2 cursor-pointer duration-200"
          >
            <PlusIcon className="h-4 w-4" /> Tạo {getTabTitle(activeTab).toLowerCase()}
          </Button>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thông tin</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              {activeTab === 'admins' && <TableHead>Vai trò</TableHead>}
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAccounts.length > 0 ? (
              currentAccounts.map((account) => (
                <TableRow key={account._id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center">
                      <img
                        src={account.avatar_url || avatar}
                        alt={account.full_name}
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <div className="font-medium">{account.full_name || 'N/A'}</div>
                        <div className="text-muted-foreground">{account.gender || 'N/A'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{account.email || 'N/A'}</TableCell>
                  <TableCell>{account.phone_number || 'N/A'}</TableCell>
                  {activeTab === 'admins' && <TableCell>{account.role || 'N/A'}</TableCell>}
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded ${
                        getStatusBadgeVariant(account.status) === 'success'
                          ? 'bg-green-100 text-green-800'
                          : getStatusBadgeVariant(account.status) === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : getStatusBadgeVariant(account.status) === 'destructive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getStatusText(account.status)}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(account.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openViewModal(account)}>
                        <ScanSearch className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(account)}>
                        <PencilIcon className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteModal(account)}>
                        <TrashIcon className="h-4 w-4 text-red-600 hover:text-red-800" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={activeTab === 'admins' ? 7 : 5} className="text-center text-muted-foreground">
                  Không tìm thấy tài khoản
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
              className="h-6 w-6 cursor-pointer"
            >
              <ChevronLeftIcon className="h-3 w-3"/>
            </Button>
            <span className="px-2 border rounded bg-white text-gray-800">{currentPage}</span>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
              className="h-6 w-6 cursor-pointer"
            >
              <ChevronRightIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
      <AddAccountModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleAddAccount}
        activeTab={activeTab}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      <EditAccountModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleUpdateAccount}
        activeTab={activeTab}
        currentAccount={currentAccount}
      />
      <ViewAccountModal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        currentAccount={currentAccount}
        activeTab={activeTab}
        formatDate={formatDate}
        getStatusBadgeVariant={getStatusBadgeVariant}
        getStatusText={getStatusText}
        getInitials={getInitials}
      />
      <DeleteAccountModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        currentAccount={currentAccount}
        deleteReason={deleteReason}
        onDeleteReasonChange={(e) => setDeleteReason(e.target.value)}
        onSubmit={handleDeleteAccount}
      />
    </div>
  );
};

export default Account;