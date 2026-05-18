import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertCircle,
  Mail,
} from "lucide-react";
import { toast } from "react-toastify";

// Shadcn UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Container from "@/Page/Shared/Responsive/Container";
import useAxiosSecure from "@/Hook/useAxiosSecure";
import type { AllUser } from "@/types/blog";
import DashboardSpinner from "@/Page/Shared/Spinner/DashboardSpinner";

type UserStatus = string;
type UserRole = string;

const ITEMS_PER_PAGE = 8;

// Status Badge Component
const getStatusBadge = (status: UserStatus) => {
  if (status === "active") {
    return (
      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-500">
        <ShieldCheck className="w-3 h-3 mr-1" /> Active
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-500">
      <ShieldAlert className="w-3 h-3 mr-1" /> Blocked
    </Badge>
  );
};

// Role Badge Component
const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case "admin":
      return (
        <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 dark:text-purple-400">
          <Shield className="w-3 h-3 mr-1" /> Admin
        </Badge>
      );
    case "volunteer":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400">
          <UserCheck className="w-3 h-3 mr-1" /> Volunteer
        </Badge>
      );
    case "donor":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          <Users className="w-3 h-3 mr-1" /> Donor
        </Badge>
      );
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

// Custom Pagination Component
interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:bg-primary/10"
            }
          />
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={page === currentPage}
              className={
                page === currentPage
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-default"
                  : "cursor-pointer hover:bg-primary/10"
              }>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:bg-primary/10"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// Main Component
const AllRegisterUser: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState<UserStatus | "all">("all");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AllUser | null>(null);

  // Fetch all users
  const {
    data: allUsers = [],
    isLoading,
    error,
  } = useQuery<AllUser[], Error>({
    queryKey: ["register-user"],
    queryFn: async () => {
      const response = await axiosSecure.get("/register-user");
      return response.data as AllUser[];
    },
  });

  // Toggle user status mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      const updateInfo = { id, status };
      await axiosSecure.patch("/update-user-status", updateInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["register-user"] });
      toast.success("User status updated successfully!");
      setStatusDialogOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast.error("Failed to update user status.");
    },
  });

  // Update user role mutation
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) => {
      const userRole = { role };
      await axiosSecure.patch(`/update-user-role/${id}`, userRole);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["register-user"] });
      toast.success("User role updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update user role.");
    },
  });

  // Filtering and Search
  const filteredUsers = useMemo(() => {
    let filtered = [...allUsers];

    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.status === filterStatus);
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerSearch) ||
          user.email.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [allUsers, filterStatus, filterRole, searchTerm]);

  // Pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterRole, searchTerm]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const handleStatusClick = (user: AllUser) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedUser) {
      const newStatus: UserStatus =
        selectedUser.status === "active" ? "block" : "active";
      statusMutation.mutate({ id: selectedUser._id, status: newStatus });
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    roleMutation.mutate({ id: userId, role: newRole });
  };

  const statusOptions = [
    { value: "all" as const, label: "All Status" },
    { value: "active" as const, label: "Active" },
    { value: "block" as const, label: "Blocked" },
  ];

  const roleOptions = [
    { value: "all" as const, label: "All Roles" },
    { value: "admin" as const, label: "Admin" },
    { value: "volunteer" as const, label: "Volunteer" },
    { value: "donor" as const, label: "Donor" },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Error Loading Users
          </h2>
          <p className="text-muted-foreground">
            Failed to load registered users. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 md:py-10">
      <Container>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground flex items-center gap-3">
            <Users className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            All Registered Users
          </h1>
          <p className="mt-2 text-base md:text-xl text-muted-foreground">
            Manage registered users, including blocking or unblocking access
            when needed.
          </p>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filter Users ({totalItems} total)
            </h2>

            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as UserStatus | "all")
              }>
              <SelectTrigger className="w-full sm:w-40 bg-card border-2">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={filterRole}
              onValueChange={(value) =>
                setFilterRole(value as UserRole | "all")
              }>
              <SelectTrigger className="w-full sm:w-40 bg-card border-2">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full lg:w-[300px] border-2"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
          <Table>
            {isLoading ? (
              <DashboardSpinner />
            ) : (
              <>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold text-primary">
                      Avatar
                    </TableHead>
                    <TableHead className="font-bold text-primary">
                      Name
                    </TableHead>
                    <TableHead className="font-bold text-primary">
                      <Mail className="w-4 h-4 inline mr-1" /> Email
                    </TableHead>
                    <TableHead className="font-bold text-primary text-center">
                      Status
                    </TableHead>
                    <TableHead className="font-bold text-primary text-center">
                      Role
                    </TableHead>
                    <TableHead className="font-bold text-primary text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow key={user._id} className="hover:bg-muted/50">
                        <TableCell>
                          <figure className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                            <img
                      src={user.photoURL || user.imageURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                      }}
                    />
                          </figure>
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(user.status)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusClick(user)}
                              className={
                                user.status === "active"
                                  ? "hover:bg-red-500/10 hover:text-red-600 hover:border-red-500"
                                  : "hover:bg-green-500/10 hover:text-green-600 hover:border-green-500"
                              }>
                              {user.status === "active" ? (
                                <>
                                  <UserX className="w-4 h-4 mr-1" />
                                  Block
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Unblock
                                </>
                              )}
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Shield className="w-4 h-4 mr-1" />
                                  Change Role
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Authorization Level
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(`${user._id}`, "admin")
                                  }>
                                  <Shield className="w-4 h-4 mr-2 text-purple-600" />
                                  Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(`${user._id}`, "volunteer")
                                  }>
                                  <UserCheck className="w-4 h-4 mr-2 text-blue-600" />
                                  Volunteer
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(`${user._id}`, "donor")
                                  }>
                                  <Users className="w-4 h-4 mr-2 text-primary" />
                                  Donor
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-12 h-12 text-muted-foreground/50" />
                          <p>No users found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </>
            )}
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <div
                key={user._id}
                className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <figure className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden shrink-0">
                    <img
                      src={user.photoURL || user.imageURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                      }}
                    />
                  </figure>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(user.status)}
                  {getRoleBadge(user.role)}
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusClick(user)}
                    className="flex-1">
                    {user.status === "active" ? (
                      <>
                        <UserX className="w-4 h-4 mr-1" />
                        Block
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        Unblock
                      </>
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Shield className="w-4 h-4 mr-1" />
                        Role
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Authorization</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(`${user._id}`, "admin")
                        }>
                        Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(`${user._id}`, "volunteer")
                        }>
                        Volunteer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(`${user._id}`, "donor")
                        }>
                        Donor
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No users found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Container>

      {/* Status Confirmation Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "active"
                ? "Block User Access?"
                : "Restore User Access?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "active"
                ? "This action will block the user from accessing the system. They will not be able to log in or perform any actions until unblocked."
                : "This action will restore the user's access to the system. They will be able to log in and use all features again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={
                selectedUser?.status === "active"
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-green-600 hover:bg-green-700"
              }>
              {statusMutation.isPending
                ? "Updating..."
                : selectedUser?.status === "active"
                  ? "Block User"
                  : "Unblock User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllRegisterUser;
