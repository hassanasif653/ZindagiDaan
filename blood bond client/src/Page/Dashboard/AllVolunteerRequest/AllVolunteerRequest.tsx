import React, { useState, useMemo, useCallback } from "react";
import { recordDonationOnBlockchain } from "@/lib/blockchain";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  AlertCircle,
  Mail,
  MapPin,
  Clock,
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
import type { VolunteerApplication } from "@/types/blog";

import DashboardSpinner from "@/Page/Shared/Spinner/DashboardSpinner";

type VolunteerStatus = string;

const ITEMS_PER_PAGE = 8;

// Status Badge Component
const getStatusBadge = (status?: VolunteerStatus) => {
  if (!status) {
    return <Badge variant="outline">Unknown</Badge>;
  }

  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-500">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
    case "approve":
      return (
        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-500">
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </Badge>
      );
    case "reject":
      return (
        <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-500">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
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
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
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

//! Main Component Here
const AllVolunteerApplications: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState<VolunteerStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(
    null
  );
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<VolunteerApplication | null>(null);

  // Fetch all volunteer applications
  const {
    data: allApplications = [],
    isLoading,
    error,
  } = useQuery<VolunteerApplication[]>({
    queryKey: ["volunteer-applications"],
    queryFn: async () => {
      const response = await axiosSecure.get("/volunteer-applications");
      return response.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosSecure.delete(`/volunteer-applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer-applications"] });
      toast.success("Volunteer application deleted successfully!");
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete volunteer application. Please try again.");
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosSecure.patch(`/volunteer-applications/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer-applications"] });
      toast.success(
        "Volunteer approved successfully! User role updated to volunteer."
      );
      setApproveDialogOpen(false);
      setSelectedApplication(null);
    },
    onError: (error) => {
      console.error("Error approving volunteer:", error);
      toast.error("Failed to approve volunteer. Please try again.");
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosSecure.patch(`/volunteer-applications/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer-applications"] });
      toast.success("Volunteer application rejected.");
      setRejectDialogOpen(false);
      setSelectedApplication(null);
    },
    onError: (error) => {
      console.error("Error rejecting volunteer:", error);
      toast.error("Failed to reject volunteer. Please try again.");
    },
  });

  // Filtering and Search Logic
  const filteredApplications = useMemo(() => {
    let filtered = [...allApplications];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.district?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allApplications, filterStatus, searchTerm]);

  // Pagination Logic
  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, currentPage]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  // Handle View Details
  const handleViewDetails = (application: VolunteerApplication) => {
    // Navigate to details page or open modal
    console.log("View details:", application);
    // navigate(`/dashboard/volunteer-details/${application._id}`);
  };

  // Handle Delete
  const handleDeleteClick = (id: string) => {
    setApplicationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (applicationToDelete) {
      deleteMutation.mutate(applicationToDelete);
    }
  };

  // Handle Approve
  const handleApproveClick = (application: VolunteerApplication) => {
    setSelectedApplication(application);
    setApproveDialogOpen(true);
  };

  const confirmApprove = async () => {
  if (!selectedApplication) return;

  try {
    // 1️⃣ FIRST blockchain popup (MetaMask)
    const result = await recordDonationOnBlockchain(
      selectedApplication.email,
      selectedApplication.name,
      "blood",
      selectedApplication.bloodGroup
    );

    if (!result.success) {
      toast.error("MetaMask transaction failed");
      return;
    }

    // 2️⃣ THEN approve in backend
    await approveMutation.mutateAsync(selectedApplication._id);

    toast.success(
      `Approved + Blockchain done: ${result.txHash?.slice(0, 10)}...`
    );

  } catch (err) {
    toast.error("Approval failed");
  }
};

  // Handle Reject
  const handleRejectClick = (application: VolunteerApplication) => {
    setSelectedApplication(application);
    setRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (selectedApplication) {
      rejectMutation.mutate(selectedApplication._id);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusOptions = [
    { value: "all", label: "All Applications" },
    { value: "pending", label: "Pending" },
    { value: "approve", label: "Approved" },
    { value: "reject", label: "Rejected" },
  ];

  // Stats
  const stats = useMemo(() => {
    return {
      total: allApplications.length,
      pending: allApplications.filter((app) => app.status === "pending").length,
      approved: allApplications.filter((app) => app.status === "approve")
        .length,
      rejected: allApplications.filter((app) => app.status === "reject")
        .length,
    };
  }, [allApplications]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center">
        <DashboardSpinner />
      </div>
    );
  }
  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Error Loading Applications
          </h2>
          <p className="text-muted-foreground">
            Failed to load volunteer applications. Please try again later.
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
            Volunteer Applications
          </h1>
          <p className="mt-2 text-base md:text-xl text-muted-foreground">
            Manage volunteer applications - approve, reject, or delete as
            needed.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary/50" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500/50" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500/50" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500/50" />
            </div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filter Applications ({totalItems} found)
            </h2>

            <Select
              onValueChange={(value: VolunteerStatus | "all") =>
                setFilterStatus(value)
              }
              value={filterStatus}>
              <SelectTrigger className="w-full sm:w-[200px] bg-card border-2">
                <SelectValue placeholder="Filter by Status" />
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
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full lg:w-[300px] border-2"
            />
          </div>
        </div>

        {/* Data Table - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold text-primary">Avatar</TableHead>
                <TableHead className="font-bold text-primary">Name</TableHead>
                <TableHead className="font-bold text-primary">
                  <Mail className="w-4 h-4 inline mr-1" /> Contact
                </TableHead>
                <TableHead className="font-bold text-primary text-center">
                  Blood Group
                </TableHead>
                <TableHead className="font-bold text-primary">
                  <MapPin className="w-4 h-4 inline mr-1" /> Location
                </TableHead>
                <TableHead className="font-bold text-primary">
                  Applied Date
                </TableHead>
                <TableHead className="font-bold text-primary text-center">
                  Status
                </TableHead>
                <TableHead className="font-bold text-primary text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApplications.length > 0 ? (
                paginatedApplications.map((application) => (
                  <TableRow key={application._id} className="hover:bg-muted/50">
                    <TableCell>
                      <figure className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                        <img
                          src={application.photoURL || "/default-avatar.png"}
                          alt={application.name}
                          className="w-full h-full object-cover"
                        />
                      </figure>
                    </TableCell>
                    <TableCell className="font-medium">
                      {application.name}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{application.email}</div>
                      {application.phone && (
                        <div className="text-xs text-muted-foreground">
                          {application.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold text-destructive">
                      {application.bloodGroup}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{application.district}</div>
                      <div className="text-xs text-muted-foreground">
                        {application.division}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(application.appliedDate)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {/* Approve Button - Only for pending */}
                        {application.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproveClick(application)}
                            className="hover:bg-green-500/10 text-green-600"
                            title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Reject Button - Only for pending */}
                        {application.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectClick(application)}
                            className="hover:bg-red-500/10 text-red-600"
                            title="Reject">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}

                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(application)}
                          className="hover:bg-primary/10"
                          title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(application._id)}
                          className="hover:bg-destructive/10 text-destructive"
                          title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-12 h-12 text-muted-foreground/50" />
                      <p>No volunteer applications found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedApplications.length > 0 ? (
            paginatedApplications.map((application) => (
              <div
                key={application._id}
                className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <figure className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden shrink-0">
                    <img
                      src={application.photoURL || "/default-avatar.png"}
                      alt={application.name}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate">
                      {application.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {application.email}
                    </p>
                  </div>
                  <Badge className="bg-destructive/10 text-destructive">
                    {application.bloodGroup}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">
                      {application.district}, {application.division}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">
                      Applied: {formatDate(application.appliedDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  {getStatusBadge(application.status)}

                  <div className="flex gap-2">
                    {application.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveClick(application)}
                          className="text-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectClick(application)}
                          className="text-red-600">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(application)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(application._id)}
                      className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No volunteer applications found</p>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Volunteer Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              volunteer application from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90">
              {deleteMutation.isPending ? "Deleting..." : "Delete Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Volunteer Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will approve {selectedApplication?.name}'s application and
              automatically update their user role to "volunteer". They will
              gain volunteer permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprove}
              className="bg-green-600 hover:bg-green-700">
              {approveMutation.isPending
                ? "Approving..."
                : "Approve Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Volunteer Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reject {selectedApplication?.name}'s volunteer
              application. They will not be granted volunteer permissions. You
              can delete this application later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              className="bg-red-600 hover:bg-red-700">
              {rejectMutation.isPending ? "Rejecting..." : "Reject Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllVolunteerApplications;
