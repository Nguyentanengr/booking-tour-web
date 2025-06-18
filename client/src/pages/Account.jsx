import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ScanSearch,
  ShieldIcon,
  UserIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  fetchAccounts,
  createAccount,
  fetchAccountById,
  updateAccount,
  deleteAccount,
  setCurrentAccount,
  clearCurrentAccount,
} from '../redux/slices/accountSlice';

const Account = () => {
  const [activeTab, setActiveTab] = useState('admins');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    type: 'admins',
  });

  const dispatch = useDispatch();
  const { accounts, pagination, currentAccount, loading } = useSelector((state) => state.accounts);
  const accountsPerPage = 10;

  useEffect(() => {
    const type = activeTab === 'guides' ? 'users' : activeTab;
    dispatch(fetchAccounts({
      type,
      search: searchTerm,
      status: statusFilter,
      page: pagination.currentPage,
      limit: accountsPerPage,
    }));
  }, [dispatch, activeTab, searchTerm, statusFilter, pagination.currentPage]);

  const handleAddAccount = () => {
    const accountData = {
      ...formData,
      type: activeTab === 'guides' ? 'users' : activeTab,
      role: activeTab === 'guides' ? 'guide' : formData.role,
    };
    dispatch(createAccount(accountData)).then(() => {
      setShowAddModal(false);
      resetForm();
    });
  };

  const handleUpdateAccount = () => {
    if (!currentAccount) return;
    const accountData = {
      ...formData,
      type: activeTab === 'guides' ? 'users' : activeTab,
      role: activeTab === 'guides' ? 'guide' : formData.role,
    };
    dispatch(updateAccount({ id: currentAccount._id, accountData })).then(() => {
      setShowEditModal(false);
      resetForm();
    });
  };

  const handleDeleteAccount = () => {
    if (!currentAccount) return;
    dispatch(deleteAccount({
      id: currentAccount._id,
      type: activeTab === 'guides' ? 'users' : activeTab,
      deleteReason,
    })).then(() => {
      setShowDeleteModal(false);
      setDeleteReason('');
      dispatch(clearCurrentAccount());
    });
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
      type: 'admins',
    });
    dispatch(clearCurrentAccount());
  };

  const openEditModal = (account) => {
    dispatch(setCurrentAccount(account));
    setFormData({
      full_name: account.fullName,
      phone_number: account.phoneNumber,
      email: account.email,
      password: '',
      avatar_url: account.avatarUrl || '',
      date_of_birth: account.dateOfBirth || '',
      gender: account.gender || '',
      status: account.status,
      role: account.role || 'admin',
      type: activeTab === 'guides' ? 'users' : activeTab,
    });
    setShowEditModal(true);
  };

  const openViewModal = (account) => {
    dispatch(fetchAccountById({ id: account._id, type: activeTab === 'guides' ? 'users' : activeTab }));
    setShowViewModal(true);
  };

  const openDeleteModal = (account) => {
    dispatch(setCurrentAccount(account));
    setShowDeleteModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  const filteredAccounts = activeTab === 'guides'
    ? accounts.filter((account) => account.role === 'guide')
    : accounts;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Đang tải danh sách tài khoản...</p>
      </div>
    );
  }

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
                <SelectItem value="deleted">Đã xóa</SelectItem>
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
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <TableRow key={account._id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center">
                      <img
                        src={account.avatarUrl || avatar}
                        alt={account.fullName}
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <div className="font-medium">{account.fullName || 'N/A'}</div>
                        <div className="text-muted-foreground">{account.gender || 'N/A'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{account.email || 'N/A'}</TableCell>
                  <TableCell>{account.phoneNumber || 'N/A'}</TableCell>
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
                  <TableCell>{formatDate(account.createdAt)}</TableCell>
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
                <TableCell colSpan={activeTab === 'admins' ? 7 : 6} className="text-center text-muted-foreground">
                  Không tìm thấy tài khoản
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={pagination.currentPage === 1}
              onClick={() => dispatch(fetchAccounts({
                type: activeTab === 'guides' ? 'users' : activeTab,
                search: searchTerm,
                status: statusFilter,
                page: pagination.currentPage - 1,
                limit: accountsPerPage,
              }))}
              className="h-6 w-6 cursor-pointer"
            >
              <ChevronLeftIcon className="h-3 w-3" />
            </Button>
            <span className="px-2 border rounded bg-white text-gray-800">{pagination.currentPage}</span>
            <Button
              variant="outline"
              size="icon"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => dispatch(fetchAccounts({
                type: activeTab === 'guides' ? 'users' : activeTab,
                search: searchTerm,
                status: statusFilter,
                page: pagination.currentPage + 1,
                limit: accountsPerPage,
              }))}
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